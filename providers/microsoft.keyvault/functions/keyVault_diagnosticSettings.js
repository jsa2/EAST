




const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

const diagnostics = await AzNodeRest(`${item.id}/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')

try {
    var logs =JSON.stringify(diagnostics).match('"categoryGroup\":\"audit\",\"enabled\":true')[0] 
    returnObject.isHealthy=true
} catch (error) {
    console.log()
}



//returnObject.metadata = {logs:{diagnostics:JSON.stringify(diagnostics)}}

returnObject.metadata = {logs:logs || {diagnostics:JSON.stringify(diagnostics)} || "no logs"}
//console.log(stashOrig)

return returnObject

}




