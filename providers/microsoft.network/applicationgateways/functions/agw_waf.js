

const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
    
let returnObject = new returnObjectInit (item,__filename.split('/').pop())


if (item?.properties.sku.match('WAF')) {
    returnObject.isHealthy=true
}

returnObject.metadata = {waf:item?.properties.sku}
//console.log(stashOrig)

return returnObject

}





