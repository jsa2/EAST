
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { getRandomInt } = require("../../../plugins/nodeSrc/nodeRestRef")
var waitT = require('util').promisify(setTimeout)
const {argv} = require('yargs')
//AzNodeRest
module.exports = async function (item) {

;

var {apiversion} = getProviderApiVersion(item.id)

var returnObject ={}
returnObject.fileName = __filename.split('/').pop()
returnObject.name = item.name
returnObject.id = item.id


console.log('waiting before enumeration of containers, to avoid throttling')

let storage
let errorProp

if (!argv.SkipStorageThrottling) {
    await waitT(getRandomInt(500,10000))
}


storage = await AzNodeRest(`${item.id}/blobServices/default/containers?`,apiversion).catch(error => errorProp = error)

/* if (errorProp?.errorBody?.error?.code == "TooManyRequests") {
    console.log('applying throttle')
    await waitT(getRandomInt(1000,10000))
    console.log()
    storage = await AzNodeRest(`${item.id}/blobServices/default/containers?`,apiversion)
}
 */

returnObject.isHealthy=true
if (storage?.value.length > 0) {

   
    var isPublic = storage.value.filter((container) => container.properties.publicAccess == "Blob" || container.properties.publicAccess == "Container").map(storage => `${storage.name} - Public:${storage.properties.publicAccess}`)

    if (isPublic.length > 0) {
        console.log(isPublic)
        returnObject.isHealthy=false
    }

    
}


returnObject.metadata = {count:storage.value.length, Public:isPublic || [] }

return returnObject

}


            