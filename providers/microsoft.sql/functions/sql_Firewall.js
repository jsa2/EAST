

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

 let fw  = await AzNodeRest(`${item.id}/firewallRules/`,apiversion)

var is = fw?.value.filter((rules) => rules.name == "AllowAllWindowsAzureIps")

if ( is.length > 0 || fw?.value.length == 0){
    returnObject.isHealthy=false
} 


returnObject.metadata = {fw}
//console.log(stashOrig)

return returnObject

}


            