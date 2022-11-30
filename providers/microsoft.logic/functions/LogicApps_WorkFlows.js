
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('microsoft.logic/workflows')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var failedMessage = "no access controls for actions or triggers"

returnObject.isHealthy=true

let matchLikelySecrets = require('../../../plugins/other/wordlist.json').values.split(',').map(word => {
    srs = JSON.stringify(item.properties.definition).toLowerCase().match(word.toLowerCase())
   // let srs2 = JSON.stringify(item.properties.definition).toLowerCase().match(new RegExp("\\?code",'g'))
 if (srs) {
     console.log()
     returnObject.isHealthy="review"
 }
   return srs
}).filter(is => is !== null).map(s => `${s[0]}:${s.input.substring(s.index-30,s.index+30)}`)

returnObject.metadata = {contents:JSON.stringify(item.properties.definition), matchLikelySecrets}
//console.log(stashOrig)

return returnObject

}

