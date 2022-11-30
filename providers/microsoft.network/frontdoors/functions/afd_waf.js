const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
    
let returnObject = new returnObjectInit (item,__filename.split('/').pop())


let WAFEnabled = item.properties.frontendEndpoints.filter(s => s?.properties?.webApplicationFirewallPolicyLink?.id)
.map(s =>s.properties.webApplicationFirewallPolicyLink ) || "no WAF"

if (WAFEnabled.length >0) {
    returnObject.isHealthy = true
}

returnObject.metadata = {WAFEnabled}
//console.log(stashOrig)

return returnObject

}


