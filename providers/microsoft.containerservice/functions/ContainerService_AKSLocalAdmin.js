
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('managedclusters')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var token = await runner('az account get-access-token --resource=https://management.core.windows.net/ --query accessToken --output json')
var {apiversion} = getProviderApiVersion(item.id)
var options = {
    url:`https://management.azure.com${item.id}?api-version=${apiversion}`,
    headers:{
        Authorization: `Bearer ${token}`
        }
    }
item = await AzNodeRest(undefined,undefined,undefined,options)


//item = await AzNodeRest(item.id,apiversion)


returnObject.isHealthy=true
if (item?.properties?.disableLocalAccounts == false ){
    returnObject.isHealthy=false
} 


returnObject.metadata = {disableLocalAccounts:item?.properties?.disableLocalAccounts}
//console.log(stashOrig)

return returnObject

}

