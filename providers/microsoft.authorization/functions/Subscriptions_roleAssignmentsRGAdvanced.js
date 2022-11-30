

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
const {argv} = require('yargs')

module.exports = async function (item) {
    
  item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
  
  
  let subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName
  //
  
  let returnObject = new returnObjectInit(item,__filename.split('/').pop())
  
 // var {apiversion} = getProviderApiVersion(item.id)
  let scope =await runner(`az group list --subscription "${subName}"`)
  
  if (scope?.length == 0) {
    returnObject.isHealthy="review"
    returnObject.metadata={assigments:[],error:"empty sub"}
    return returnObject
  }
  
  var value = []
  if (argv.includeRG) {

    for await (let gr of scope) {
      let {value:vals} = await AzNodeRest(`${gr.id}/providers/Microsoft.Authorization/roleAssignments?$filter=atScope()`,"2021-04-01-preview")
      console.log('enum of RG ',gr.id)
      vals.forEach(v => value.push(v))
    }

    let nq = []
    let chk = []
    value.forEach(v => {
      let sd = `${v.properties?.principalId}:${v.properties.scope}:${v.properties.roleDefinitionId}`
      if (chk.includes(sd)) {
        //console.log('assignment already present')
      } else {
        chk.push(sd)
        nq.push(v)
      }
    })
    value = nq
  
  } else {
    var {value} = await AzNodeRest(`${scope[0].id}/providers/Microsoft.Authorization/roleAssignments?$filter=atScope()`,"2021-04-01-preview")
    value = value.filter( s => s.properties?.scope !== '/')
  }

  

  // Expand users in group to users
  let grps = value.filter(s =>s.properties.principalType.toLowerCase() == "group").map( s => {
    return {
      principalId:s.properties.principalId,
      roleInfo:s
    }
  })
 
  if (grps.length > 0) {
    let obInGroup = await batchObjectsGroup(grps)
    //Change roleAssignment to user
      
    let d = []
 if (obInGroup.values.length > 0) {
  obInGroup.values.filter(s => s["@odata.type"] !== "processed").map(s => {
        
    if (s["@odata.type"] == "#microsoft.graph.user") {
      var principalType = "User"
    } else {
      var principalType = "Application"
    }

    if (s.refInfo["@odata.type"]){
        s.refInfo = s.refInfo?.refInfo || s.refInfo?.refInfo?.refInfo || "nesting too deep" 
    }
    
if (s.refInfo.roleInfo.id) {
  value.push({
    properties:{ 
      principalId:s.id,
      principalType,
      roleDefinitionId:s.refInfo.roleInfo.properties.roleDefinitionId,
      scope:s.refInfo.roleInfo.properties.scope
    },
    id:s.refInfo.roleInfo.id,
    name:s.refInfo.roleInfo.name,
    type:s.refInfo.roleInfo.type,
  })
}
    
  })

 }

      
  }
  
  
  // Expand servicePrincipals in group to SPN


  // take all values that are assigned permissions subscription level
  var value = value.filter(s =>  s.properties.principalType.toLowerCase() !== "group")
  
  const {roles} = await checkRoles(returnObject.name)
  const rls = []
  
  if (value.length > 0) {
      value.map((role) => {
       
        

       console.log(role.id)
       let lookFor = role?.properties.roleDefinitionId.toLowerCase().split('/').pop()
       let roleMatch = roles.find(match => match.id.toLowerCase().match(lookFor))
        //require('fs').writeFileSync('roles.json',JSON.stringify(roles))
       if (!roleMatch?.properties?.roleName) {
         console.log()
       } else {
         console.log()
       }
       role.RoleName = roleMatch?.properties?.roleName || 'no match'
       role.principalId = role?.properties?.principalId || 'no match'
       role.principalType = role?.properties?.principalType || 'no match'
       delete role.properties
       delete role.type
       })
       
       rls.push({role:value})
   }
  
   const checkSPn = [] 
   const batch = []
   rls[0].role.filter(oid =>oid.principalType == "ServicePrincipal" ).map((item) => checkSPn.push(item.principalId))
   var uniqUcheckSPn = new Set(checkSPn)
  
   
  for await (let spn of uniqUcheckSPn.values()) {
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
    for await (let user of uniqU.values()) {
  
    
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
  
  returnObject.isHealthy="review"
  
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
let results = []

async function batchObjectsGroup (res) {
 
  var graphToken = await getGraphToken()
  
   res.map((ob) => {
  
    ob.runContext= {
       fn: genericGraph,
       opts:{
        responseType: 'json',
        "method": "get",
        url:`https://graph.microsoft.com/beta/groups/${ob.principalId}/members?$select=id,userPrincipalName,displayName`,
        headers:{
            'content-type':"application/json",
            authorization:"Bearer " + graphToken
        },
        refInfo:ob
      /*   timeout:2000 */
    }
    }
  })
  
  
  
  results.push (await batchThrottledSimple(4,res)) 
  
  results = results.flat()
  results.map((item) => delete item.runContext)
  
  // Check for one layer of nesting for users and SPN's - OTOH we could call the same function in loop, but it creates complexity I dont need here 
  var newRound =results[0]?.value.filter(s => s["@odata.type"] == "#microsoft.graph.group")
  if (newRound?.length > 0) {
    newRound.map(s => {
      s.principalId=s.id
      s["@odata.type"] = "processed"
    })
     await batchObjectsGroup(newRound)
  } 
 
  let final =results.map(s => s.value.map(d => {
    d.refInfo = s.refInfo
    return d
  }))
    

 return {values:final.flat()}
  }

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
  

      

