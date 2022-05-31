


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

if (item?.properties?.publicNetworkAccess == "Enabled" && item.properties?.privateEndpointConnections.length > 0) {
    returnObject.isHealthy = false
}

returnObject.metadata = {publicNetworkAccess:item?.properties?.publicNetworkAccess, privateEndpointConnections: item.properties?.privateEndpointConnections }
//console.log(stashOrig)

return returnObject

}


