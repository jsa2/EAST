


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply, checkDoesItApplyFn } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())


let skip = checkDoesItApplyFn(item,returnObject)
if (skip) {
    return skip
}

let data = await AzNodeRest(`${item.id}/host/default/properties/status`,'2018-11-01')


if (!data?.properties?.version?.split('.')[0].match('4')) {
    
    returnObject.isHealthy=false
}

returnObject.metadata = {runtime:data?.properties?.version}
//console.log(stashOrig)

return returnObject

}


