



const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
returnObject.metadata={} 
returnObject.isHealthy="manual"
return returnObject

}


