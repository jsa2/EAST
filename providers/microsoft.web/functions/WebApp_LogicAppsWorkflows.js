
/* const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit") */
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { checkDoesItApplyWorkflowApp } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { azNodeRestRef } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
//const { checkDoesItApplyWorkflowApp } = require("../../../plugins/nodeSrc/microsoftwebhelper")


//AzNodeRests
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

returnObject.metadata = {workflows:JSON.stringify(contents) || "no contents"}
//console.log(stashOrig)

return returnObject

}





