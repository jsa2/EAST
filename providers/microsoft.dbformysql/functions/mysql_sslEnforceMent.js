

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

if (item?.properties?.sslEnforcement !== "Disabled") {
returnObject.isHealthy = true
}

returnObject.metadata={sslEnforcement:item?.properties?.sslEnforcement}

return returnObject

}


