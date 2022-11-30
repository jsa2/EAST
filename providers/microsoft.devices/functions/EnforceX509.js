

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('IotHubs')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

returnObject.isHealthy=false
if ( item?.properties?.disableDeviceSAS == true && item?.properties?.disableModuleSAS == true){
    returnObject.isHealthy=true
} 



returnObject.metadata = {SASAuthDisabled:item?.properties?.disableDeviceSAS || ["SAS Auth is enabled"]}
//console.log(stashOrig)

return returnObject

}

