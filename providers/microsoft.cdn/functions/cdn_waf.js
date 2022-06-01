
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

let securityPolicies = await AzNodeRest(`${item.id}/securityPolicies?`,'2021-06-01')


returnObject.metadata = {securityPolicies}
//console.log(stashOrig)

return returnObject

}




