


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getLaAPItoken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
//getLaAPItoken
//AzNodeRest
module.exports = async function (item) {

    var returnObject = new returnObjectInit(item, __filename.split('/').pop())
    try {
       
    
        let token = await getLaAPItoken()

    /*     
        Regarding Log Analytics API and Azure Resource Manager: 
        You don't need to define the log analytics workspace where the logs are stored for the resource, if you pass the resource ID as part of the URI in POST request. 
    
        */
        let queryOpts = {
           method:"post", 
           url:`https://api.loganalytics.io/v1${item.id}/query?scope=hierarchy`,
            headers:{
                Authorization: `Bearer ${token}`
            },
            data:{
                "query": "AzureDiagnostics \n| distinct OperationName, CallerIPAddress, identity_claim_appid_g, httpStatusCode_d  \n | take 1000",
            }
        }

        let {tables} = await AzNodeRest(undefined,undefined,undefined,queryOpts) 

        returnObject.metadata={callers:tables[0]?.rows}
        returnObject.isHealthy="review"
        return returnObject
    } catch (error) {

        returnObject.metadata = {errors:"unable to get diagnostic results", error}
        returnObject.isHealthy="Manual"
        return returnObject

    }



}


