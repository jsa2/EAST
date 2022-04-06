

const { getMFAStatus, getBasicAuthStatus } = require("../../../plugins/nodeSrc/aadHelpers")
const { batchThrottledSimple } = require("../../../plugins/nodeSrc/batch")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { genericGraph, graph, graph2 } = require("../../../plugins/nodeSrc/graph")
const { checkRoles } = require("../../../plugins/nodeSrc/listRoles")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")
const basicAuth = require("../../microsoft.azureactivedirectory/functions/basicAuth")


/* let item = {
  id: "/subscriptions/3539c2a2-cd25-48c6-b295-14e59334ef1c/providers/microsoft.authorization",
  name: "3539c2a2-cd25-48c6-b295-14e59334ef1c",
  type: "microsoft.authorization",
  isHealthy: false,
}
 */
//
//AzNodeRest
module.exports = async function (item) {
    
item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`


var subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName


var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var {apiversion} = getProviderApiVersion(item.id)
let scope =await runner(`az group list --subscription "${subName}"`)
var {value} = await AzNodeRest(`${scope[0].id}/providers/Microsoft.Authorization/roleAssignments?$filter=atScope()`,"2021-04-01-preview")

// take all values that are assigned permissions subscription level
var value = value.filter(s => s.properties.scope !== "/" && s.properties.principalType.toLowerCase() !== "group")

const {roles} = await checkRoles(returnObject.name)
const rls = []

if (value.length > 0) {
    value.map((role) => {
     
     console.log(role.id)
     const roleMatch = roles.find((match) => match.id == role?.properties.roleDefinitionId)
     role.RoleName = roleMatch.properties.roleName || 'no match'
     role.principalId = role.properties.principalId || 'no match'
     role.principalType = role.properties.principalType || 'no match'
     delete role.properties
     delete role.type
     })
     
     rls.push({role:value})
 }

 const checkSPn = [] 
 const batch = []
 rls[0].role.filter(oid =>oid.principalType == "ServicePrincipal" ).map((item) => checkSPn.push(item.principalId))
 var uniqUcheckSPn = new Set(checkSPn)

 
for await (spn of uniqUcheckSPn.values()) {
  batch.push({id:spn})
}



var checkCA = [] 
rls[0].role.filter(oid =>oid.principalType == "User" ).map((item) => checkCA.push(item.principalId))

//https://graph.microsoft.com/beta/servicePrincipals/${principalId}?$select=id,displayName,appId`
//https://graph.microsoft.com/beta/applications?$filter=appId eq '${app.appId}'&$select=keyCredentials,passwordCredentials,appid,displayName`,


var uniqU = new Set(checkCA)

const appCredsR = await batchApps(batch)

const mfaBatch = []

if (process.env.checkMFA == "true")  {
  for await (user of uniqU.values()) {

  
    batch.push({id:user})
    mfaBatch.push({id:user})
  
    if (user == "08c1be1f-0f1d-4971-af96-c4750814011a") {
      console.log()
    }
  
  }
}

const mfaResults = await batchMfa(mfaBatch)

const displayNames = await batchObjects(batch)



// Map names to user

returnObject.isHealthy=true

rls[0].role.map((item) => {
  item.subName=subName
  item.friendlyName = displayNames.find(user => user.id == item.principalId )?.userPrincipalName|| displayNames.find(user => user.id == item.principalId )?.displayName || "no match"
  item.mfaResults = mfaResults.find(ob => ob.oid == item.principalId)?.statuses || "CA Evaluated only for users currently"
  item.creds = appCredsR.find(ob => ob.id == item.principalId) || "This type of credential does not apply to user"
  //console.log(item.creds)
  item.principalType = appCredsR.find(ob => ob.id == item.principalId)?.servicePrincipalType || item.principalType 


})


returnObject.metadata = {subName,assigments:rls[0].role}
//console.log(stashOrig)
returnObject.name = subName
return returnObject

}

//genericGraph()

async function batchObjects (res) {

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
  
  
  
  var results = await batchThrottledSimple(4,res)
  results.map((item) => delete item.runContext)
  
  return results
  
      
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
    
    let results = await batchThrottledSimple(3,res)
    
    return results

  }

  async function batchApps (res) {

    res.map((ob) => {
  
      ob.runContext= {
         fn: getAppCreds,
         opts:ob
        /*   timeout:2000 */
      }
    })

    let appRes = await batchThrottledSimple(3,res)
    
    return appRes

  }
  
  
  
  async function getAppCreds (spn) {

  let appToken = await getGraphToken()
  var credentials
  const app = await graph2(appToken,`https://graph.microsoft.com/beta/servicePrincipals/${spn.id}?$select=id,displayName,appId,keyCredentials,passwordCredentials,servicePrincipalType`) || "no creds"
  //console.log(app)
    if (typeof(app) === "object") {
      //console.log(app)

    if (app.servicePrincipalType !== "ManagedIdentity") {
       credentials = await graph2(appToken,`https://graph.microsoft.com/beta/applications?$filter=appId eq '${app.appId}'&$select=keyCredentials,passwordCredentials,appid,displayName,id`)
       credentials = credentials[0]
    }
    
      app.passwordCredentials = app.passwordCredentials|| "No SPN credentials"
      app.keyCredentials = app.keyCredentials || "No SPN credentials"
      app.AppRegPasswordCred =credentials?.passwordCredentials || "No application credentials"
      app.AppRegKeyCred = credentials?.keyCredentials || "No application credentials"
  }

  return app

  }
  

      

