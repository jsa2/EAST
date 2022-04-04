


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())
let metadata = {}

if (item.properties?.adminUserEnabled == false ) {
    returnObject.isHealthy = true
}

// Change to healthy, if network rules are used
if ((item.properties?.networkRuleSet?.ipRules?.length > 0 || item.properties?.networkRuleSet?.virtualNetworkRules?.length > 0 )) {
    returnObject.isHealthy = true
}

metadata.adminUserEnabled = item.properties?.adminUserEnabled 


returnObject.metadata = {anonymousPullEnabled:item.properties?.adminUserEnabled }
//console.log(stashOrig)

return returnObject

}


