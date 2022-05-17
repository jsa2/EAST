

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
    
let returnObject = new returnObjectInit (item,__filename.split('/').pop())

returnObject.isHealthy="not applicable"
var is 
if (item.properties?.privateEndpointConnections?.length > 0) {

     is = (item.properties.networkAcls.ipRules.length > 0 || item.properties.networkAcls.virtualNetworkRules.length  > 0) || undefined

if (is == undefined){
    returnObject.isHealthy=false
} else {
    returnObject.isHealthy=true
}


}



returnObject.metadata = {networkAcls: item.properties?.networkAcls, privateEndpointConnections: item.properties?.privateEndpointConnections}
//console.log(stashOrig)

return returnObject

}





