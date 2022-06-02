


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.sku?.name == "premium") {
 returnObject.isHealthy = true
}


returnObject.metadata = {sku:item?.sku?.name}
//console.log(stashOrig)

return returnObject

}


