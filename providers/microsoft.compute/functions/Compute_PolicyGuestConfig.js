


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.type.match('microsoft.compute/virtualmachines') ||item?.id.match('/extensions') || item.id.match('virtualmachinescalesets') ) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

returnObject.isHealthy="review"

let AzurePolicy

if (item?.resources)  {
    AzurePolicy =item?.resources.find(extension => extension.name == "AzurePolicyforLinux"|| "AzurePolicyForWindows" ) || "No Policy Agent"

    if (AzurePolicy?.properties?.provisioningState) {
        returnObject.isHealthy = true
        delete AzurePolicy.properties
    }
}



returnObject.metadata = {AzurePolicy: AzurePolicy || "not applicable" }
//console.log(stashOrig)

return returnObject

}


