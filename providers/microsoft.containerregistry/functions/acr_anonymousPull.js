


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.isHealthy = true
if (item.properties?.anonymousPullEnabled == true ) {
    returnObject.isHealthy = false
}

returnObject.metadata = {anonymousPullEnabled:item.properties?.anonymousPullEnabled }
//console.log(stashOrig)

return returnObject

}


