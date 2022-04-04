

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

if (item?.properties?.networkProfile?.networkPlugin.toString().length > 3) {
    returnObject.isHealthy=true
}
returnObject.metadata=item?.properties?.networkProfile || {}
return returnObject

}


