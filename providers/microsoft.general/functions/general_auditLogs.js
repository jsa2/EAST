



const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

const returnObject = new returnObjectInit(item,__filename.split('/').pop())

item.isHealthy = "manual"
returnObject.metadata = {item}
//console.log(stashOrig)

return returnObject

}


