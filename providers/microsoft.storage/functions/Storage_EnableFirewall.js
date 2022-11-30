
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())


var is = (item.properties.networkAcls.ipRules.length > 0 || item.properties.networkAcls.virtualNetworkRules.length  > 0) || undefined

if (is == undefined){
    returnObject.isHealthy=false
} else {
    returnObject.isHealthy=true
}


returnObject.metadata = item.properties.networkAcls
//console.log(stashOrig)

return returnObject

}

