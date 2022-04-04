


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

var {value:linkedSvc} = await AzNodeRest(`${item.id}/linkedservices?`,apiversion)
returnObject.isHealthy=true
var list= linkedSvc.map(svc => {
    svc.safeCredential = true
    delete svc.id
    delete svc.etag
    delete svc.type
    if (JSON.stringify(svc).match('encrypted')) { 
        returnObject.isHealthy=false
        svc.safeCredential=false
        svc.properties.typeProperties.encryptedCredential = `${svc.properties.typeProperties.encryptedCredential.substring(0,10)}...REDACTED`
    }
    if (svc.properties.annotations.length == 0) {
        delete  svc.properties.annotations
    }
    return {svc:JSON.stringify(svc)}
})

returnObject.metadata = {list}
//console.log(stashOrig)

return returnObject

}


