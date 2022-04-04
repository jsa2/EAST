

const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
    
var returnObject = new returnObjectInit (item,__filename.split('/').pop())

let WAFEnabled = item.properties.frontendEndpoints.filter(s => s?.properties?.webApplicationFirewallPolicyLink?.id)
.map(s =>s.properties.webApplicationFirewallPolicyLink ) || "no WAF"

if (WAFEnabled.length >0) {
    let mode = await AzNodeRest(WAFEnabled[0].id,'2020-11-01')
    var policySettings = mode.properties.policySettings

    if (policySettings.mode.toLowerCase() == "prevention") {
        returnObject.isHealthy = true
    }
}

returnObject.metadata =  {res:item?.properties?.frontendEndpoints || {}}
//console.log(stashOrig)

return returnObject

}





