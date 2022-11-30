


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('microsoft.network/publicipaddresses') || !item?.properties?.ipConfiguration) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

if (item?.properties?.ipConfiguration) {

var attachment = item?.properties?.ipConfiguration.id.split('ipConfigurations')[0]
var identifier = item?.properties?.ipConfiguration.id.split('Microsoft.Network')[1]
try {var netset = await AzNodeRest(`${attachment}?$expand=ipConfigurations/publicIPAddress,networkSecurityGroup`,'2021-03-01')} catch (error) {
    console.log('not matching for NSG')
}

if (netset) {

let nicNsgResults = netset?.properties?.networkSecurityGroup
if (nicNsgResults) {

    var nicNSGapplied = nicNsgResults.properties.securityRules.filter(s => s.properties.access == 'Allow' && s.properties.sourceAddressPrefix == "*" && s.properties.direction == "Inbound")

}

var vnet =netset.properties.ipConfigurations[0].properties.subnet.id.split('/subnets')[0]

var vnetConfig = await AzNodeRest(`${vnet}?$expand=subnets/ipConfigurations`,'2021-03-01')

var subnetNSG = vnetConfig.properties.subnets.filter(sub => sub.id == netset.properties.ipConfigurations[0].properties.subnet.id)[0]?.properties?.networkSecurityGroup
if (subnetNSG) {

    var subnetNSGResults = await AzNodeRest(subnetNSG.id,'2021-03-01')

    var subNSGapplied = subnetNSGResults.properties.securityRules.filter(s => s.properties.access == 'Allow' && s.properties.sourceAddressPrefix == "0.0.0.0/0" && s.properties.direction == "Inbound")
 
}

}




returnObject.isHealthy = true
returnObject.metadata = {identifier,publicIp:item?.properties?.ipAddress, nicNsgResults:nicNSGapplied || "no NSG results", subnetNSGResults: subNSGapplied || 'no NSG results'}
//console.log(stashOrig)

return returnObject

}

}

