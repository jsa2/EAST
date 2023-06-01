const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { graph } = require("../../../plugins/nodeSrc/graph")
const { checkRoles } = require("../../../plugins/nodeSrc/listRoles")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { iterateMI } = require("../../../plugins/nodeSrc/miGeneral")
module.exports = async function (item) {

  

    let returnObject = new returnObjectInit(item,__filename.split('/').pop())


    if (!item?.id.match('/microsoft.compute/virtualmachines') ||item?.id.match('/extensions') ) {
        returnObject.metadata = {}
        returnObject.isHealthy="notApplicable"
        return returnObject
    }

    let identityList
    try {identityList =  await iterateMI(item)} catch(err) {
        console.log(err)
    
    }
   

    
    returnObject.name = item.name
    returnObject.id = item.id
    returnObject.metadata = {identityList}

    return returnObject
}
