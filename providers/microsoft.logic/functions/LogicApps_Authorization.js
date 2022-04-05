

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
if (!item?.id.match('microsoft.logic/workflows')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

if (item?.properties?.definition?.triggers?.manual?.kind.toLowerCase() == "http") {
       console.log('sd')
    }



return returnObject

}


