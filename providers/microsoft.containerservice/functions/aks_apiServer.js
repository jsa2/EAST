

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.properties?.apiServerAccessProfile) {
    returnObject.isHealthy=true
}

returnObject.metadata={apiServerAccessProfile: item?.properties?.apiServerAccessProfile|| "No API server restrictions"} 
return returnObject

}


