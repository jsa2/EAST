


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item.properties?.networkRuleSet?.ipRules?.length > 0 || item.properties?.networkRuleSet?.virtualNetworkRules.length > 0 ) {
    returnObject.isHealthy = true
}

returnObject.metadata = item.properties?.networkRuleSet|| {}
//console.log(stashOrig)

return returnObject

}


