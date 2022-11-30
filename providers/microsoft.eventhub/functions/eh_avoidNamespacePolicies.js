

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { azNodeRestRef } = require("../../../plugins/nodeSrc/nodeRestRef")
//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

let {value} = await azNodeRestRef(`${item.id}/authorizationRules`,'2017-04-01')
let nameSpaceLevel = value.filter(s => !s.name.match('RootManageSharedAccessKey')) 

if (!nameSpaceLevel.length > 0) {
    returnObject.isHealthy=true
}

returnObject.metadata=nameSpaceLevel 

return returnObject

}


