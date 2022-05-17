

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
    
let returnObject = new returnObjectInit (item,__filename.split('/').pop())

returnObject.isHealthy="not applicable"

if (item.properties?.privateEndpointConnections?.length > 0) {

    let is = (item.properties.networkAcls.ipRules.length > 0 || item.properties.networkAcls.virtualNetworkRules.length  > 0) || undefined

if (is == undefined){
    returnObject.isHealthy=false
} else {
    returnObject.isHealthy=true
}


}



returnObject.metadata = {item}
//console.log(stashOrig)

return returnObject

}





