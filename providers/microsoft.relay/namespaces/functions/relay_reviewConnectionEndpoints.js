

const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
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

returnObject.isHealthy="review"

let {apiversion} = getProviderApiVersion(item.id)

let {value:HybridConnections} =    await AzNodeRest(`${item.id}/hybridConnections/`,apiversion)

returnObject.metadata={HybridConnections}

return returnObject

}


