


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var graphSecurityKey = "82e20e14-edc5-4373-bfc4-f13121257c37"
var options = {
    method: "post",
    url: `https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2018-09-01-preview`,
    data: {
        subscriptions: JSON.parse(process.env.subs).map(sub => sub.id),
        "options": {
            "$skip": 0,
            "$top": 60,
            "$skipToken": "",
            resultFormat: "ObjectArray"
        },
        query: `securityresources | where type == "microsoft.security/assessments/subassessments"
        | extend assessmentKey = extract(@"providers/Microsoft.Security/assessments/([^/]*)", 1, id)
        | extend resourceIdTemp = iff(properties.resourceDetails.id != "", properties.resourceDetails.id, extract("(.+)/providers/Microsoft.Security", 1, id))
        | extend resourceId = iff(properties.resourceDetails.source =~ "OnPremiseSql", strcat(resourceIdTemp, "/servers/", properties.resourceDetails.serverName, "/databases/" , properties.resourceDetails.databaseName), resourceIdTemp)
        | extend resourceName = extract(@"(.+)/(.+)", 2, resourceId)
        | extend resourceIdentifier = iff(properties.resourceDetails.source =~ "OnPremiseSql", tostring(properties.resourceDetails.sourceComputerId), extract(@"(.+)/servers/", 1, resourceId))
        | extend resourceIdentifier = tolower(resourceIdentifier)
        | extend status = tostring(properties.status.code), severity=tostring(properties.status.severity)
        | where tolower(status) != "notapplicable"
        | where assessmentKey =~ "${graphSecurityKey}"
        | where id startswith "${item.id}"
        | distinct  tostring(properties.resourceDetails.id), tostring(properties.description), tostring(properties.impact), status, tostring(properties.id)
        `
    }

}

var {data:assessments} = await AzNodeRest(undefined,undefined,undefined,options) || "no results"

assessments.map(r => {


    Object.keys(r).filter(k => k.match('properties')).forEach(k => {
        r[k.split('properties_')[1]] = r[k]
        delete r[k]
    })

    r.database= r.resourceDetails_id.split('/').pop()
   // delete  r.id
})
returnObject.isHealthy="manual"


var s =assessments.find(r => r.status.toLowerCase() == "unhealthy")
if (s) {
    returnObject.isHealthy =false
}

returnObject.metadata = {assessments}
//console.log(stashOrig)

return returnObject

}


