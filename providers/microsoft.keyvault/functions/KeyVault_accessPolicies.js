const { batchThrottledSimple } = require("../../../plugins/nodeSrc/batch")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { genericGraph } = require("../../../plugins/nodeSrc/graph")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

var keyToCheck = item?.properties?.accessPolicies

const uniqL = []
keyToCheck.map(ob => {
    var c ={id:ob.objectId}
    if (!uniqL.includes(c)) {
        uniqL.push(c)
    }
})
const displayNames = await batchLocally(uniqL,5)
if (keyToCheck) {
    var accessPolicy = []
    keyToCheck.map((ap) => {
        var displayName = displayNames.find(s => s.id == ap.objectId)?.displayName || "no graph match"
        var ob = {
            id:ap.objectId,
            permissions:[],
            displayName
        }
        Object.keys(ap.permissions).map((perm) => {
            ob.permissions.push(`${perm}:${ap.permissions[perm].length}`)
        })
        accessPolicy.push(ob)

    })
    item.combined = accessPolicy
}

returnObject.isHealthy="manual"

returnObject.metadata = {accessPolicy}
//console.log(stashOrig)

return returnObject

}

async function batchLocally (res) {
//getGraphToken
    var graphToken = await getGraphToken()
    
     res.map((ob) => {
    
      ob.runContext= {
         fn: genericGraph,
         opts:{
          responseType: 'json',
          "method": "get",
          url:`https://graph.microsoft.com/v1.0/directoryObjects/${ob.id}?$select=id,userPrincipalName,displayName`,
          headers:{
              'content-type':"application/json",
              authorization:"Bearer " + graphToken
          },
        /*   timeout:2000 */
      }
      }
    })
    
    
    
    const results = await batchThrottledSimple(4,res)
    results.map((item) => delete item.runContext)
    
    return results
    
        
    }


            