
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('managedclusters')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

if ( item?.properties?.agentPoolProfiles[0]?.osDiskType == true){
    returnObject.isHealthy=true
} 

returnObject.metadata = {osDiskType: item?.properties?.agentPoolProfiles[0]?.osDiskType}
//console.log(stashOrig)

return returnObject

}

