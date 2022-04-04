


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

    //https://docs.microsoft.com/en-us/rest/api/sql/2021-02-01-preview/databases/list-by-server
var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

item = await AzNodeRest(`${item.id}/firewallRules/`,apiversion)

var is = item?.value.filter((rules) => rules.name == "AllowAllWindowsAzureIps")

if ( is.length > 0){
    returnObject.isHealthy=false
} 

returnObject.metadata = {item}
//console.log(stashOrig)

return returnObject

}


