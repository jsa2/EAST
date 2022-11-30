

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { graph } = require("../../../plugins/nodeSrc/graph")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var graphToken = await getGraphToken()

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

var {apiversion} = getProviderApiVersion(item.id)


var skip = checkDoesItApply(item,returnObject)
if (skip) {
    return skip
}


var {properties:v1}=await AzNodeRest(`${item.id}/config/authsettings`,apiversion)
var {properties:v2}=await AzNodeRest(`${item.id}/config/authsettingsV2/list`,'2021-02-01')



//var src = v1?.enabled || v2?.platform
if (v1?.enabled || v2?.platform?.enabled) {

    returnObject.isHealthy=true

    if (item.name.match('mitest')) {
        console.log()
    }
    

    if (v1?.enabled) {
        var app  = await graph(graphToken,`servicePrincipals?$filter=appId eq '${v2?.identityProviders?.azureActiveDirectory?.registration?.clientId}'`)
        var app  = app[0]
     } 
    if (v2?.identityProviders?.azureActiveDirectory?.registration?.clientId) {
       var app  = await graph(graphToken,`servicePrincipals?$filter=appId eq '${v2?.identityProviders?.azureActiveDirectory?.registration?.clientId}'`)
       var app  = app[0]
    }

    if (app?.appRoleAssignmentRequired == false) {
        returnObject.metadata={exceptions:"Assignment not Required",displayName:app?.displayName || "not an aad app"}
        returnObject.isHealthy="healthy-withExceptions"
    }
    else {
        returnObject.metadata={exceptions:"",displayName:app?.displayName || "not an aad app"}
     }
  

    
    //var app = await graphList(graphToken,`servicePrincipals/${item}`)
}
else {
    returnObject.isHealthy=false
    returnObject.metadata = {result:"no aad auth"}
}


//console.log(stashOrig)

return returnObject

}


            