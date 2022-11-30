

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('managedClusters')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

const diagnostics = await AzNodeRest(`${item.id}/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')

try {
    var apiServer =JSON.stringify(diagnostics).match('apiserver\\",\\"categoryGroup\\":null,\\"enabled\\":true')[0] 
var admin =JSON.stringify(diagnostics).match('kube-audit-admin\\",\\"categoryGroup\\":null,\\"enabled\\":true')[0] 
} catch (error) {
    console.log()
}


if (admin && apiServer){
    returnObject.isHealthy=true
} 


returnObject.metadata = {apiServer:apiServer || "not enabled", admin:admin || "not enabled"}
//console.log(stashOrig)

return returnObject

}


            