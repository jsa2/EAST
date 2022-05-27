

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)

returnObject.isHealthy=true
let diagnostics

if (JSON.stringify(item?.tags).match('azure-cloud-shell')) {

 diagnostics= await AzNodeRest(`${item.id}/fileServices/default/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')

returnObject.isHealthy="review"

if ( diagnostics?.value.length == 0){
    returnObject.isHealthy=false
} 

}

returnObject.metadata={tags:item?.tags || "no tags",diagnostics} 

return returnObject

}


