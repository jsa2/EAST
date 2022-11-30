
// Creates a new map, no need to push the results

const { AzNodeRest } = require('../plugins/nodeSrc/east');
const { getLaAPItoken } = require('../plugins/nodeSrc/getToken');


//sd(require('../content.json'))

async function sd (src) { 

    const processed = src.filter(s => s.controlId == "keyVault_diagnosticSettings" && s.isHealthy == true) 
  //getLaAPItoken
    if (processed?.length < 0) {
        return;
    }

    let returnable = [] 
    let token = await getLaAPItoken()

    for await (let sds of processed) {

        
        let returnObject =new newObjectCreater(sds)
       
        returnObject.controlId = "composite_AzureKeyVault_ReviewCallers"
        returnObject.Description = "Review list of distinct consumers of the Key Vault - top10 is returned for last 30 days. This function produces results when the Key Vault has export settings enabled for Log Analytics workspace"
        

        try {
       
            let queryOpts = {
               method:"post", 
               url:`https://api.loganalytics.io/v1${returnObject.id}/query?scope=hierarchy`,
                headers:{
                    Authorization: `Bearer ${token}`
                },
                data:{
                    "query": "AzureDiagnostics | distinct OperationName, CallerIPAddress, identity_claim_appid_g, httpStatusCode_d  | sort by CallerIPAddress asc | take 1000",
                }
            }
    
            let {tables} = await AzNodeRest(undefined,undefined,undefined,queryOpts) 
    
            returnObject.metadata={callers:tables[0]?.rows}
            returnObject.isHealthy="review"
            returnable.push(returnObject)
        } catch (error) {
    
            returnObject.metadata = {errors:"unable to get diagnostic results", error}
            returnObject.isHealthy="Manual"
            returnable.push(returnObject)
    
        }


    }
  
    return returnable

}


module.exports = async function (src) { 

    
    const processed = src.filter(s => s.controlId == "keyVault_diagnosticSettings" && s.isHealthy == true) 
  //getLaAPItoken
    if (processed?.length < 0) {
        return;
    }

    let returnable = [] 
    let token = await getLaAPItoken()

    for await (sds of processed) {

        
        let returnObject =new newObjectCreater(sds)
       
        returnObject.controlId = "composite_AzureKeyVault_ReviewCallers"
        returnObject.Description = "Review list of distinct consumers of the Key Vault. This function produces results when the Key Vault has export settings enabled for Log Analytics workspace"
        

        try {
       
            let queryOpts = {
               method:"post", 
               url:`https://api.loganalytics.io/v1${returnObject.id}/query?scope=hierarchy`,
                headers:{
                    Authorization: `Bearer ${token}`
                },
                data:{
                    "query": `AzureDiagnostics
                    | where TimeGenerated > now() -30d
                    | summarize ['events'] = count(), ['Source'] =make_set(strcat(CallerIPAddress, '-', OperationName, ":", httpStatusCode_d)) by identity_claim_appid_g
                    | top 10 by events`,
                }
            }
    
            let {tables} = await AzNodeRest(undefined,undefined,undefined,queryOpts)
            
            tables[0]?.rows.sort((a,b) => {
                
               if (JSON.stringify(a) > JSON.stringify(b)  ) {
                    return -1
               }

            })
    
            returnObject.metadata={callers:tables[0]?.rows}
            returnObject.isHealthy="review"
            returnable.push(returnObject)
        } catch (error) {
    
            returnObject.metadata = {errors:"unable to get diagnostic results", error}
            returnObject.isHealthy="Manual"
            returnable.push(returnObject)
    
        }


    }
  
    return returnable

}

function newObjectCreater (data) {
    this.data={}
   Object.keys(data).map(f => this.data[f] = data[f])
    return this.data
}

