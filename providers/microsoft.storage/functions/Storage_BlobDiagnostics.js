
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

let diagnostics = await AzNodeRest(`${item.id}/blobServices/default/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')


if ( diagnostics.value.length > 0){
    returnObject.isHealthy=true
} 

returnObject.metadata = {BlobDiagnostics: diagnostics.value.length > 0|| ["No diagnostic settings enabled"]}
//console.log(stashOrig)

return returnObject

}

