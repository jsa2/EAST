

const { default: axios } = require("axios")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
returnObject.metadata={} 
returnObject.isHealthy=true

let {value} = await AzNodeRest(`${item.id}/runs?top=10`,'2016-06-01')

value = value.splice(0,2)

let promArra = []

value.map(run => {
   
    try {
        //
        promArra.push( axios({url:value[0].properties.response.outputsLink.uri}))
    } catch (error) {
        console.log('no link')
    }

    try {
        //
        promArra.push( axios({url:run.properties.trigger.inputsLink.uri}) )
    } catch (error) {
        console.log('no link')
    }

    try {
        //
   
        promArra.push( axios({url:run.properties.trigger.outputsLink.uri}) )
    } catch (error) {
        console.log('no link')
    }
    
    

    //console.log(sd)
})

let res = await (await Promise.all(promArra)).map(s => s?.data)

let matchLikelySecrets = require('../../../plugins/other/wordlist.json').values.split(',').map(word => {
    srs = JSON.stringify(res).toLowerCase().match(word.toLowerCase())
   // let srs2 = JSON.stringify(item.properties.definition).toLowerCase().match(new RegExp("\\?code",'g'))
 if (srs) {
    returnObject.isHealthy="review"
 }
   return srs
}).filter(is => is !== null).map(s => `${s[0]}:${s.input.substring(s.index-30,s.index+30)}`)

returnObject.metadata = {matchLikelySecrets}
//console.log(stashOrig)


return returnObject

}


