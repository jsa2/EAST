const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
module.exports = async function (item) {

   
    var returnObject = new returnObjectInit(item,__filename.split('/').pop())


    let configs = await AzNodeRest(`${item.id}/config/web?`,'2018-11-01')
  
    var keyToCheck = configs?.properties?.ftpsState

    if (keyToCheck == "Disabled") {
        returnObject.isHealthy=true 
        keyToCheck="FTP is not allowed"
    }
  
    returnObject.metadata = {ftpsState:keyToCheck || ["FTP is allowed"]}


    return returnObject
}
