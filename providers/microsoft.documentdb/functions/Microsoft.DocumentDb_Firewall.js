


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var failedMessage = "no access controls for actions or triggers"
var accessControls = (item?.properties?.ipRules || item?.properties?.isVirtualNetworkFilterEnabled ) || failedMessage

returnObject.metadata = {accessControls}
//console.log(stashOrig)

return returnObject

}


