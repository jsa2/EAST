


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getAppliedNSG } = require("../../../plugins/nodeSrc/getEffectiveNSG")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
//const { testConnection } = require("../../../test")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('microsoft.network/publicipaddresses')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

if (item?.properties?.ipConfiguration) {

var attachment = item?.properties?.ipConfiguration.id.split('ipConfigurations')[0]


var netset = await AzNodeRest(`${attachment}`,'2021-03-01')


if (netset.id.match('networkInterfaces')) {

const results = await getAppliedNSG(netset.id)

    returnObject.isHealthy = "manual"
    returnObject.metadata = {results}
    return returnObject
}

}

returnObject.isHealthy = true
returnObject.metadata = {results:item?.type}
//console.log(stashOrig)

return returnObject

}


