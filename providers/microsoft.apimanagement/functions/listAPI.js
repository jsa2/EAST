
const { batchThrottledSimple } = require("../../../plugins/nodeSrc/batch")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { makeSingleArray } = require("../../../plugins/nodeSrc/recursor")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
//returnObjectInit
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
var {apiversion} = getProviderApiVersion(item.id)


let apis = await AzNodeRest(`${item.id}/apis?expandApiVersionSet=true`,apiversion)


var opsToReturn = await batchOps(apis?.value)

opsToReturn.map(sub => {
    let jwt = sub.definition.match('validate-jwt')
    sub.jwtAuthentication=JSON.stringify(jwt)
})


if (item?.properties) {
    returnObject.isHealthy=false
}
else {
    returnObject.isHealthy=true
}

returnObject.metadata = opsToReturn

return returnObject

}


async function listOpsPerAPI(res) {

let resource = await AzNodeRest(`${res}/operations`,'2020-12-01')

resource.value.map(ob => {
    ob.runContext= {
        fn: listPoliciesPerOp,
        opts:ob.id
       /*   timeout:2000 */
     }
})

const operations= await batchThrottledSimple(2,resource.value)

// add main level Policy
let mains = await AzNodeRest(`${res}`,'2021-04-01-preview')

let mainPolicy = await AzNodeRest(`${res}/policies/policy?format=xml`,'2021-08-01')
operations.push(
    {
    api:mains?.properties?.displayName || "",
    operation:"all operations", 
    definition:mainPolicy?.properties?.value || "not found",
    subscriptionRequired:mains?.properties?.subscriptionRequired || ""

})
return operations
}


async function listPoliciesPerOp(res) {

    let policy = await AzNodeRest(`${res}/policies/policy?format=xml`,'2021-08-01')
    
    return {api:res.split('/apis/')[1].split('/operations')[0],operation:res.split('/operations/')[1], definition:policy?.properties?.value || "not found" }
    }
    
   
async function batchOps (list) {

    list.map((ob) => {
  
        ob.runContext= {
           fn: listOpsPerAPI,
           opts:ob.id
          /*   timeout:2000 */
        }
      })

  const operations= await batchThrottledSimple(4,list)
  const respArr = []
  makeSingleArray(operations,respArr)
  return respArr
}



