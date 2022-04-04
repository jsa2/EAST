const { default: axios } = require("axios")
const { getCaPolicies } = require("../../../plugins/nodeSrc/aadHelpers")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")


//AzNodeRest
module.exports = async function (item) {

 var data = await getCaPolicies()

 var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.name = item.name
returnObject.id = item.name

if (item?.properties) {
    returnObject.isHealthy=false
}
else {
    returnObject.isHealthy=true
}

returnObject.metadata = data

return returnObject

}

