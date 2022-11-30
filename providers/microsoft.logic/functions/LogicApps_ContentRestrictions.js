
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('microsoft.logic/workflows')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var failedMessage = "no access controls for contents"
var accessControls = item?.properties?.accessControl?.contents?.allowedCallerIpAddresses || failedMessage
returnObject.isHealthy=false
if ( accessControls !== failedMessage){
    returnObject.isHealthy=true
}


returnObject.metadata = {accessControls}
//console.log(stashOrig)

return returnObject

}

