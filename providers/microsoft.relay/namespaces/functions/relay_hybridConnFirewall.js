

const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")


module.exports = async function (item) {

  /* 
// relay changed to namespace based folder lookup
if (!item?.type == "microsoft.relay/namespaces") {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
} */

let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

returnObject.isHealthy="manual"



let {apiversion} = getProviderApiVersion(item.id)

let {value:networkSettings} =    await AzNodeRest(`${item.id}/networkrulesets/`,apiversion)

if (networkSettings[0].properties?.ipRules.length == 0 && networkSettings[0].properties?.virtualNetworkRules.length == 0) {
    returnObject.isHealthy=false
}

returnObject.metadata={networkSettings}

return returnObject

}


