


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

if (item?.properties?.minimalTlsVersion == "1.2" ) {
    returnObject.isHealthy=true
}

returnObject.metadata = {minimalTlsVersion:item?.properties?.minimalTlsVersion}
//console.log(stashOrig)

return returnObject

}


