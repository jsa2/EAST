const { default: axios } = require("axios")
const { decode } = require("jsonwebtoken")
const { getMFAStatus, getBasicAuthStatus } = require("../../../plugins/nodeSrc/aadHelpers")
const { batchThrottledSimple } = require("../../../plugins/nodeSrc/batch")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { genericGraph } = require("../../../plugins/nodeSrc/graph")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {

var data = await main()

let returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.name = item.name
returnObject.id = item.name


returnObject.isHealthy="manual"

returnObject.metadata = data

return returnObject

}


async function main () {

var graphToken = await getGraphToken()

var {value:roles} = await genericGraph({
   responseType: 'json',
   "method": "get",
   url: `https://graph.microsoft.com/beta/directoryRoles/`,
   headers: {
     'content-type': "application/json",
     authorization: "Bearer " + graphToken
   }
 }).catch((error) => {
   console.log(error)
 })

 roles.map((item) => {

  item.runContext= {
     fn: genericGraph,
     opts:{
      refInfo:item?.displayName,
      responseType: 'json',
      "method": "get",
      url:`https://graph.microsoft.com/beta/directoryRoles/${item.id}/members`,
      headers:{
          'content-type':"application/json",
          authorization:"Bearer " + graphToken
      },
    /*   timeout:2000 */
  }
  }
})


let admins = await batchThrottledSimple(7,roles)

let mfabatch = []
admins.forEach(admin => {
  let ob = admin.value.filter( s => s['@odata.type'].match('user')).map(sd => {
    return {
      id:sd.id,
      userPrincipalName:sd.userPrincipalName
    }
  })
  if (ob.length > 0 && !mfabatch.includes(ob)) {
    ob.forEach(o => mfabatch.push(o))
  }
})

console.log()

let mfaStatus = await batchMfa(mfabatch)

admins.map((item) => delete item['@odata.context'])

let failedPolicies =[]

admins.forEach((item) =>  item.value.map((user,index) => {

 let mfaForUser = mfaStatus.find(ref => ref.oid == user.id) || "CA not evaluated for non-users"
 
 if (user['@odata.type'].match('user')) {

  if (mfaForUser?.statuses?.basicAuth?.appliedPol.length == 0 || mfaForUser?.statuses?.MFAstatus?.appliedPol.length == 0 ) {
    failedPolicies.push(mfaForUser)
  }

 }

 let rtrn = {
   role:item?.refInfo,
   object: `${user.userPrincipalName || user.displayName} - ${user['@odata.type']}`,
   basicAuth: mfaForUser?.statuses?.basicAuth?.appliedPol.length || "no eval, or using security defaults",
   mfa: mfaForUser?.statuses?.MFAstatus?.appliedPol.length || "no eval, or using security defaults"
 }


 item.value[index] = rtrn
}))

admins.sort((a,b) => {

  if (a?.refInfo < b?.refInfo ) {
    return -1;
} else {
    return 0
}

})

let results = admins.filter(item => item.value.length > 0)




  

console.log('')  
 
 return {
  results
 }


}


async function getfullStatus (oid) {

  let basicAuth = await getBasicAuthStatus(oid)  
  let MFAstatus = await getMFAStatus(oid)
  
  
  return {oid, statuses:{basicAuth,MFAstatus}}
  
  }


  async function batchMfa (res) {
 
    res.map((ob) => {
   
     ob.runContext= {
        fn: getfullStatus,
        opts:ob.id
       /*   timeout:2000 */
     }
   })
     
     let results = await batchThrottledSimple(5,res)
     
     return results
 
   }
