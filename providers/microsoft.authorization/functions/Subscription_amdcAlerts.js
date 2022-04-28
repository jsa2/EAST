


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let sub = item.id
item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
var subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName
returnObject.isHealthy=true

var options = {
    method:"post",
    url:`https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2018-09-01-preview`,
    data: {
        subscriptions: [sub],
        "options": {
            "$skip": 0,
            "$top": 50,
            "$skipToken": "",
            resultFormat: "ObjectArray"
        },
        query: `securityresources
        | where ['type'] == "microsoft.security/locations/alerts" `
    }

    }
 

try {
let {data} = await AzNodeRest(undefined,undefined,undefined,options) 


if (data.find(st => st.properties?.Status == "Active")) {
    returnObject.isHealthy = false
}

var results = data.map(it => {
 
    return {
        active:it?.properties?.Status,
        type:it?.properties?.AlertType,
        details:it?.properties?.AlertUri,
        metadata:JSON.stringify(it)
    }
})

if (results.length == 0) {item.isHealthy = true}

returnObject.metadata = {results}
//console.log(stashOrig)

var subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName
returnObject.name = subName

return returnObject

} catch (error) {

        returnObject.isHealthy="not applicable"
        returnObject.metadata={error: JSON.stringify(error)}
        return returnObject
    
}



}


