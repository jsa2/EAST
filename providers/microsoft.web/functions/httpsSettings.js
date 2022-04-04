const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {

   
    var returnObject = new returnObjectInit(item,__filename.split('/').pop())


    var skip = checkDoesItApply(item,returnObject)
    if (skip) {
        return skip
    }

    var keyToCheck = item?.properties?.httpsOnly

    returnObject.isHealthy=false
    if (keyToCheck) {
        returnObject.isHealthy=true}
   

    returnObject.metadata = {httpsOnly:keyToCheck || ["Plain HTTP is allowed"]}


    return returnObject
}
