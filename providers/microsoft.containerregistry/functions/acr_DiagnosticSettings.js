
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

const diagnostics = await AzNodeRest(`${item.id}/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')

try {
    var logs =JSON.stringify(diagnostics).match('ContainerRegistryRepositoryEvents","categoryGroup":null,"enabled":true')[0] 
    returnObject.isHealthy=true
} catch (error) {
    console.log()
}

try {
    var loginLogs =JSON.stringify(diagnostics).match('ContainerRegistryLoginEvents","categoryGroup":null,"enabled":true')[0] 
} catch (error) {
    console.log()
}





returnObject.metadata = {loginLogs: loginLogs || "no login logs",logs:logs || {diagnostics:JSON.stringify(diagnostics)} || "no logs"}
//console.log(stashOrig)

return returnObject

}




