
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
//AzNodeRest
module.exports = async function (item) {
//https://docs.microsoft.com/en-us/rest/api/appservice/web-apps/get-scm-allowed
let returnObject = new returnObjectInit(item,__filename.split('/').pop())

var {apiversion} = getProviderApiVersion(item.id)

var skip = checkDoesItApply(item,returnObject)
if (skip) {
    return skip
}

returnObject.isHealthy=true

item = await AzNodeRest(`${item.id}/basicPublishingCredentialsPolicies/scm/`,apiversion)

var is = item?.properties?.allow == true || undefined

if ( is){
    returnObject.isHealthy=false
    is = `${item?.type} ${JSON.stringify(item?.properties)}`
} 

returnObject.metadata = {basicAuthEnabled:is || ['basic auth is disabled']}
//console.log(stashOrig)

return returnObject

}

