const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

var skip = checkDoesItApply(item,returnObject)
if (skip) {
    return skip
}


var item = await AzNodeRest(`${item.id}/config/web`,"2020-06-01")

if ( JSON.stringify(item.properties?.ipSecurityRestrictions).match('Allow all')) {
    //console.log('got this for network rest', item.properties?.ipSecurityRestrictions)
    returnObject.isHealthy=false
}
else {
    returnObject.isHealthy=true
}

returnObject.metadata = {
    ipSecurityRestrictions: item.properties?.ipSecurityRestrictions,
    scmIpSecurityRestrictions:item.properties?.scmIpSecurityRestrictions,

}


return returnObject

}

