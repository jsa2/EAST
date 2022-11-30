
const { batchThrottledSimple } = require("../../../plugins/nodeSrc/batch")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { makeSingleArray } = require("../../../plugins/nodeSrc/recursor")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
//returnObjectInit
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
var {apiversion} = getProviderApiVersion(item.id)

returnObject.isHealthy="review"

let backends = await AzNodeRest(`${item.id}/backends`,apiversion)
returnObject.metadata={backends:JSON.stringify(backends)}

return returnObject

}

