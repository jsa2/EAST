
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

let ruleList  = []

returnObject.isHealthy="review"

try {

    const {value:rules} = await AzNodeRest(`${item.id}/ruleSets?`,'2021-06-01')

    for await (rule of rules) {

        ruleList.push(await AzNodeRest(`${item.id}/ruleSets/${rule.name}/rules`,'2021-06-01'))
    }

} catch (error) {
    returnObject.isHealthy="manual"
}


let headerMatch = JSON.stringify(ruleList).match('"headerName":')

if (headerMatch) {
    returnObject.isHealthy=true
}


returnObject.metadata = {headersArePresent:JSON.stringify(headerMatch?.input) || "it appears no security headers are set, since there are no header rules present"}
//console.log(stashOrig)

return returnObject

}




