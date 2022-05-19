


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { azNodeRestRef, azNodeRestRefDyn } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


var {apiversion} = getProviderApiVersion(item.id)

var {value:pipelines} = await AzNodeRest(`${item.id}/pipelines?`,apiversion)

let matchLikelySecrets = pipelines.map(c => {

    let r = require('../../../plugins/other/wordlist.json').values.split(',').map(word => {
       let srs = JSON.stringify(c).toLowerCase().match(word.toLowerCase())
       // let srs2 = JSON.stringify(item.properties.definition).toLowerCase().match(new RegExp("\\?code",'g'))
     if (srs) {
         console.log()
         returnObject.isHealthy="review"
     }
     return srs
    }).filter(is => is !== null).map(s => `${c.name}:${s.input.substring(s.index-30,s.index+30)}`)

    return r
    

}).filter(s => s.length > 0)




returnObject.isHealthy="manual"
returnObject.metadata = {matchLikelySecrets}
//console.log(stashOrig)

return returnObject

}


