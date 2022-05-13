


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

const { azNodeRestRef, azNodeRestRefDyn, azNodeRestRefDyn2 } = require("../../../plugins/nodeSrc/nodeRestRef")
//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('/microsoft.compute/virtualmachines') ||item?.id.match('/extensions') ) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var graphSecurityKey = "3b20e985-f71f-483b-b078-f30d73936d43"
var options = {
    method:"post",
    url:`https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2018-09-01-preview`,
    data: {
        subscriptions: JSON.parse(process.env.subs).map(sub => sub.id),
        "options": {
            "$skip": 0,
            "$top": 10,
            "$skipToken": "",
            resultFormat: "ObjectArray"
        },
        query: `securityresources | where type =~ "microsoft.security/assessments" 
                | where ['name'] == "${graphSecurityKey}" | where id =~ "${item.id}/providers/Microsoft.Security/assessments/${graphSecurityKey}" `
    }

    }

    
    
/* let item1 = await AzNodeRest(undefined,undefined,undefined,options).catch(error => {
    console.log('check for throttling')
}) */

let item1 = await azNodeRestRefDyn2(undefined,undefined,undefined,options,undefined,undefined,1).catch(error => console.log(error))

returnObject.isHealthy= "review"

returnObject.metadata = {publicIpAssessment:item1.data[0]?.properties?.status?.description ||  item1.data[0]?.properties?.status?.cause || "manual"}

if (JSON.stringify(returnObject.metadata).match('The VM is non-internet-facing')) {
    returnObject.isHealthy = true
}

return returnObject

}


