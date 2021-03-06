
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.properties?.allowSharedKeyAccess == false) {
    returnObject.isHealthy=true
} 


returnObject.metadata = {allowSharedKeyAccess:item?.properties?.allowSharedKeyAccess}
//console.log(stashOrig)

return returnObject

}

