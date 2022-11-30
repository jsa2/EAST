


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let sub = item.id
item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
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

let results = data.map(it => {

/* 

// Sorting function for Keys (check first that property exists, later if it is array, these could be done on the same, but this is attempt at defensive programming if there is some error in the IsArray() )
   
*/

if (it?.properties) {

    // sort as long as ExtendedProperties is not an array 

    if (!Array.isArray(it?.properties)) { 
        Object.keys(it?.properties).sort( (a,b) => {

            if (a.toLowerCase() > b.toLowerCase() ) {
                return -1
            }
        
        })
    }


}

    if (it?.properties?.ExtendedProperties) {

        // sort as long as ExtendedProperties is not an array 

        if (!Array.isArray(it?.properties?.ExtendedProperties)) { 

            Object.keys(it?.properties?.ExtendedProperties).sort( (a,b) => {

                if (a.toLowerCase() > b.toLowerCase() ) {
                    return -1
                }
            
            })
        }

        

    }
 
    return {
        active:it?.properties?.Status,
        type:it?.properties?.AlertType,
        details:it?.properties?.AlertUri,
        metadata:it
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
        returnObject.metadata={error: JSON.stringify(error),results:[]}
        return returnObject
    
}



}


