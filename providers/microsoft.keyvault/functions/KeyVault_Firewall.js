
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


if ( item?.properties?.networkAcls){
    returnObject.isHealthy=true
}  

returnObject.metadata = {networkAcls:item?.properties?.networkAcls || "no network ACL's"}
//console.log(stashOrig)

return returnObject

}


