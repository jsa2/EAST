
/* const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit") */
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { checkDoesItApplyWorkflowApp } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { azNodeRestRef } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
//const { checkDoesItApplyWorkflowApp } = require("../../../plugins/nodeSrc/microsoftwebhelper")


//AzNodeRests s
module.exports = async function (item) {
       
let returnObject = new returnObjectInit (item,__filename.split('/').pop())


let skip = checkDoesItApplyWorkflowApp(item,returnObject)
if (skip) {
    return skip
}

let {value:workflows} = await AzNodeRest(`${item.id}/workflows`,'2018-11-01')

let promR = []

workflows.map(s =>  promR.push(azNodeRestRef(s?.id,'2018-11-01')))

let contents = await Promise.all(promR)

let matchLikelySecrets = contents.map(c => {

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


returnObject.metadata = {contents: matchLikelySecrets}

/* returnObject.metadata = {workflows:JSON.stringify(contents) || "no contents"} */
//console.log(stashOrig)

return returnObject

}





