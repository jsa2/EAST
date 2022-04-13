

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (!item?.id.match('/microsoft.compute/virtualmachines') ||item?.id.match('/extensions') ) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var graphSecurityKey = "83f577bd-a1b6-b7e1-0891-12ca19d1e6df"
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
                | where ['name'] == "${graphSecurityKey}" | where id contains "${item.id}/providers/Microsoft.Security/assessments/${graphSecurityKey}" `
    }

    }

    console.log(options.data.query)

let item1 = await AzNodeRest(undefined,undefined,undefined,options)
let status = item1.data[0]?.properties?.status?.code || "manual"

if (status.toLowerCase() == 'notapplicable') {
    status = "manual"
}

if (status.toLowerCase() == 'unhealthy') {
    status = false
}

returnObject.isHealthy= status

returnObject.metadata = {endpointProtection:item1.data[0]?.properties?.status?.description ||  item1.data[0]?.properties}
//console.log(stashOrig)

return returnObject

}


