
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
var waitT = require('util').promisify(setTimeout)
//AzNodeRest
module.exports = async function (item) {

var returnObject = {}

var {apiversion} = getProviderApiVersion(item.id)

var returnObject ={}
returnObject.fileName = __filename.split('/').pop()
returnObject.name = item.name
returnObject.id = item.id


console.log('waiting before enumeration of containers, to avoid throttling')

await waitT(3000)
item = await AzNodeRest(`${item.id}/blobServices/default/containers?`,apiversion)

returnObject.isHealthy=true
if (item?.value.length > 0) {

   
    var isPublic = item.value.filter((container) => container.properties.publicAccess == "Blob" || container.properties.publicAccess == "Container").map(item => `${item.name} - Public:${item.properties.publicAccess}`)

    if (isPublic.length > 0) {
        console.log(isPublic)
        returnObject.isHealthy=false
    }

    
}


returnObject.metadata = {count:item.value.length, Public:isPublic || [] }

return returnObject

}


            