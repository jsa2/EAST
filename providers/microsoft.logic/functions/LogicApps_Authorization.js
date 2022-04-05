

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
if (!item?.id.match('microsoft.logic/workflows')) {
    returnObject.metadata = JSON.stringify(item.properties?.accessControl)
    returnObject.isHealthy="notApplicable"
    return returnObject
}

returnObject.metadata = {}
returnObject.isHealthy="notApplicable"

if (item?.properties?.definition?.triggers?.manual?.kind.toLowerCase() == "http" && !item.properties?.accessControl?.triggers?.openAuthenticationPolicies) {
       
    returnObject.metadata = item?.properties?.definition?.triggers
    returnObject.isHealthy=false
   
    }

    
if (item?.properties?.definition?.triggers?.manual?.kind.toLowerCase() == "http" && item.properties?.accessControl?.triggers?.openAuthenticationPolicies) {
       
    returnObject.metadata = item?.properties?.definition?.triggers
    returnObject.isHealthy=true
   
    }

  



return returnObject

}


