


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { azNodeRestRef, azNodeRestRefDyn } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


var {apiversion} = getProviderApiVersion(item.id)

var {value:pipelines} = await AzNodeRest(`${item.id}/pipelines?`,apiversion)

let matchLikelySecrets = require('../../../plugins/other/wordlist.json').values.split(',').map(word => {
    srs = JSON.stringify(pipelines).toLowerCase().match(word.toLowerCase())
    

    if (word.toLowerCase() == "accountkey") {
    console.log()
    }
    return srs
}).filter(is => is !== null).map(s => `${s.input.substring(s.index,s.index+300)}`)



returnObject.isHealthy="manual"
returnObject.metadata = {matchLikelySecrets}
//console.log(stashOrig)

return returnObject

}


