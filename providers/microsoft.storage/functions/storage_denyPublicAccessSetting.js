
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.properties?.allowBlobPublicAccess == false) {
    returnObject.isHealthy=true
} 


returnObject.metadata = {allowBlobPublicAccess:item?.properties?.allowBlobPublicAccess}
//console.log(stashOrig)

return returnObject

}

