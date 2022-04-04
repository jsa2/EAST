


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


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


