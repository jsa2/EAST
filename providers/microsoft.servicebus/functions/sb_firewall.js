

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { azNodeRestRef } = require("../../../plugins/nodeSrc/nodeRestRef")
//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

let {properties:networkSettings} = await azNodeRestRef(`${item.id}/networkrulesets/default`,'2021-06-01-preview')
returnObject.isHealthy=true

if (networkSettings.ipRules.length == 0 && networkSettings.virtualNetworkRules.length == 0) {
    returnObject.isHealthy=false
}

returnObject.metadata=networkSettings 

return returnObject

}


