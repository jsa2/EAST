const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var skip = checkDoesItApply(item,returnObject)
if (skip) {
    return skip
}


let config = await AzNodeRest(`${item.id}/config/web`,"2020-06-01")

if ( config.properties?.vnetName ) {
 
    if (config.properties?.vnetRouteAllEnabled == "review") {
        returnObject.isHealthy=false
    }

    if (config.properties?.vnetRouteAllEnabled == true) {
        returnObject.isHealthy=true
    }

    
}
else {
    returnObject.isHealthy="not applicable"
}

returnObject.metadata = {vnetRouteAllEnabled:config.properties?.vnetRouteAllEnabled, vnetName:  config.properties?.vnetRouteAllEnabled}

return returnObject

}

