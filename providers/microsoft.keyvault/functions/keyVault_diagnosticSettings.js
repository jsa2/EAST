


const { diagReview } = require("../../../plugins/nodeSrc/confirmDiag")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

    var returnObject = new returnObjectInit(item, __filename.split('/').pop())
    try {
        //third argument "requireAll" means that all of the categories need to be enabled, default is that single category is required
        let diag = await diagReview(item, ['audit', 'allLogs'])
        returnObject.metadata = {
            diagnostics:JSON.stringify(diag)
        }
        returnObject.isHealthy=diag.isHealthy
        return returnObject
    } catch (error) {

        returnObject.metadata = error
        returnObject.isHealthy="manual"
        return returnObject

    }



}


