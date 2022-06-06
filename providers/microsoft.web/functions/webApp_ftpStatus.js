const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getAzWebAppConfig } = require("../../../plugins/nodeSrc/webAppConfig")
module.exports = async function (item) {

   
    var returnObject = new returnObjectInit(item,__filename.split('/').pop())


    let configs =  await getAzWebAppConfig(item)
    //let configs = await AzNodeRest(`${item.id}/config/web?`,'2018-11-01')
  
    var ftpsState = configs?.properties?.ftpsState

    if (ftpsState == "Disabled") {
        returnObject.isHealthy=true 
        keyToCheck="FTP is not allowed"
    }
  
    returnObject.metadata = {ftpsState:configs?.properties?.ftpsState}


    return returnObject
}
