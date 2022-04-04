

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.properties?.disableLocalAuth == true) {
    returnObject.isHealthy = true
}

returnObject.metadata=item.properties 
return returnObject

}


