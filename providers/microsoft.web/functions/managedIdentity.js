
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { iterateMI } = require("../../../plugins/nodeSrc/miGeneral")

module.exports = async function (item) {

    let returnObject = new returnObjectInit(item,__filename.split('/').pop())

    let skip = checkDoesItApply(item,returnObject)
    if (skip) {
        return skip
    }

    
    let identityList
    try {identityList =  await iterateMI(item)} catch(err) {

        console.log(err)
    
    }
   
    if (identityList) {
        returnObject.isHealthy=true
    }
    
    returnObject.name = item.name
    returnObject.id = item.id
    returnObject.metadata = {identityList}

    return returnObject
}
