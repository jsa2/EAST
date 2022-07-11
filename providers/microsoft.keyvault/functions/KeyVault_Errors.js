


const { diagReview } = require("../../../plugins/nodeSrc/confirmDiag")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { getLaAPItoken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
//getLaAPItoken
//AzNodeRest
module.exports = async function (item) {

    var returnObject = new returnObjectInit(item, __filename.split('/').pop())
    try {
        //third argument "requireAll" means that all of the categories need to be enabled, default is that single category is required
       /*  let diag = await diagReview(item, ['audit', 'allLogs'])
        returnObject.metadata = {
            diag
        } */

        

        let token = await getLaAPItoken()

        let queryOpts = {
            method:"post",
            url:`https://api.loganalytics.io/v1/subscriptions/6c052e74-e3b3-401b-8734-fafc98c8cf83/resourceGroups/RG-Audit/providers/Microsoft.KeyVault/vaults/hackedvault/query?scope=hierarchy`,
            headers:{
                Authorization: `Bearer ${token}`
            },
            data:{
                "query": "AzureDiagnostics \n| where TimeGenerated > now() -2d \n| distinct OperationName, CallerIPAddress, identity_claim_appid_g",
            }
        }

        let qr = await AzNodeRest(undefined,undefined,undefined,queryOpts) 

        returnObject.isHealthy=diag.isHealthy
        return returnObject
    } catch (error) {

        returnObject.metadata = error
        returnObject.isHealthy="manual"
        return returnObject

    }



}


