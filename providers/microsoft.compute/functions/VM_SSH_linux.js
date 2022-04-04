

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

var graphSecurityKey = "22441184-2f7b-d4a0-e00b-4c5eaef4afc9"
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

returnObject.isHealthy= item1.data[0]?.properties?.status?.code || "manual"

returnObject.metadata = {sshSettings:item1.data[0]?.properties?.status?.description ||  item1.data[0]?.properties?.status?.code|| "manual" }
//console.log(stashOrig)

return returnObject

}


