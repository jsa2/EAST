

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())

//console.log(stashOrig)
returnObject.isHealthy=true
const templatePolicies = Object.keys(item?.properties).filter((key) =>key.match('enabledFor') && item.properties[key] == true).map(key => `${key}:${item.properties[key]}` )
console.log(templatePolicies)

if (templatePolicies.length > 0) {
    returnObject.isHealthy = false
}
returnObject.metadata= templatePolicies

return returnObject

}


