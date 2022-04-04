const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
module.exports = async function (item) {

   
    var returnObject = new returnObjectInit(item,__filename.split('/').pop())


    var skip = checkDoesItApply(item,returnObject)
    if (skip) {
        return skip
    }
    var keyToCheck = item?.properties?.siteConfig?.ftpsState
    returnObject.isHealthy=false
    if (keyToCheck) {
        returnObject.isHealthy=true }
  
    returnObject.metadata = {ftpsState:keyToCheck || ["FTP is allowed"]}


    return returnObject
}
