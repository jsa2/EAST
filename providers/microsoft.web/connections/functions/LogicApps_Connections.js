

const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
    
var returnObject = new returnObjectInit (item,__filename.split('/').pop())


returnObject.metadata = {item}
//console.log(stashOrig)
returnObject.isHealthy="review"
return returnObject

}





