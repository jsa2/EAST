


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
returnObject.metadata={}
return returnObject

}


