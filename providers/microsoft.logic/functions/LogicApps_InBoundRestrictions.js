
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('microsoft.logic/workflows')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var failedMessage = "no access controls for actions or triggers"
var accessControls = (item?.properties?.accessControl?.triggers || item?.properties?.accessControl?.actions ) || failedMessage
returnObject.isHealthy=false
if ( accessControls !== failedMessage){
    returnObject.isHealthy=true

    if (item?.properties?.accessControl?.triggers?.allowedCallerIpAddresses?.length == 0 && item?.properties?.accessControl?.actions?.allowedCallerIpAddresses?.length == 0 ) {
        accessControls="Only Other Logic Apps"
    }
}


returnObject.metadata = {accessControls}
//console.log(stashOrig)

return returnObject

}

