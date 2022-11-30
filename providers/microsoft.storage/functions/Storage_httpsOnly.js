
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())


var is = item?.properties?.supportsHttpsTrafficOnly == false

if (is){
    returnObject.isHealthy=false
} else {
    returnObject.isHealthy=true
}


returnObject.metadata = {supportsHttpsTrafficOnly:item?.properties?.supportsHttpsTrafficOnly}
//console.log(stashOrig)

return returnObject

}

