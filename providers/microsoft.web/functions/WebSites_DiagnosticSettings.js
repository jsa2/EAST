


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var skip = checkDoesItApply(item,returnObject)
if (skip) {
    return skip
}
var {apiversion} = getProviderApiVersion(item.id)

if (item?.id.match('sqli') ) {
console.log()
}

const diagnostics = await AzNodeRest(`${item.id}/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')

try {
    var logs =JSON.stringify(diagnostics).match('FunctionAppLogs\",\"categoryGroup\":null,\"enabled\":true')[0] 
    returnObject.isHealthy=true
} catch (error) {
    console.log()
}

try {
    var appServicelogs =JSON.stringify(diagnostics).match('AppServiceAuditLogs\",\"categoryGroup\":null,\"enabled\":true')[0] 
    returnObject.isHealthy=true
} catch (error) {
    console.log()
}




returnObject.metadata = {logs:logs || {appServicelogs,diagnostics:JSON.stringify(diagnostics)} || "no logs"}
//console.log(stashOrig)

return returnObject

}


