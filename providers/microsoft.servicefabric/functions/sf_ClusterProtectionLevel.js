


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


try {
    var EncryptAndSign =JSON.stringify(item?.properties?.fabricSettings).match('EncryptAndSign')[0] 
    returnObject.isHealthy=true
} catch (error) {
    console.log()
}

returnObject.metadata = {result:EncryptAndSign || "failed"}
//console.log(stashOrig)

return returnObject

}


