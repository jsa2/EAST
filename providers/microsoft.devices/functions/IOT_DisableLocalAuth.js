

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('IotHubs')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

if ( item?.properties?.disableLocalAuth == true){
    returnObject.isHealthy=true
} else {
    returnObject.isHealthy=false
}



returnObject.metadata = {localAuth:item?.properties?.disableLocalAuth || ['local auth is enabled']}
//console.log(stashOrig)

return returnObject

}

