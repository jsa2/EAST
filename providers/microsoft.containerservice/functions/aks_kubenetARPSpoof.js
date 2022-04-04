

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.isHealthy=true
if (item?.properties?.networkProfile?.networkPlugin.match('kubenet')) {
    returnObject.isHealthy=false
}

returnObject.metadata=item.properties.networkProfile
return returnObject

}


