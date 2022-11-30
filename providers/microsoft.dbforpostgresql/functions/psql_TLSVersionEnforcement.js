

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

if (item?.properties?.minimalTlsVersion == "TLS1_2") {
returnObject.isHealthy = true
}

returnObject.metadata={minimalTlsVersion:item?.properties?.minimalTlsVersion}

return returnObject

}


