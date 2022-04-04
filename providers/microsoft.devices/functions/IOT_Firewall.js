
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var {apiversion} = getProviderApiVersion(item.id)
var fw =  item.properties.ipFilterRules
returnObject.isHealthy=false
if ( fw.length > 0){
    returnObject.isHealthy=true
} 

if (fw.length > 0) {fw=fw} else {fw=["No fw settings enabled"]}

returnObject.metadata = {fw}
//console.log(stashOrig)

return returnObject

}



