


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


var accessControls = (item?.properties?.ipRules || item?.properties?.isVirtualNetworkFilterEnabled ) 

if (accessControls.length > 0) {
    returnObject.isHealthy=true
}

returnObject.metadata = {accessControls: accessControls || "no access controls"}
//console.log(stashOrig)

return returnObject

}


