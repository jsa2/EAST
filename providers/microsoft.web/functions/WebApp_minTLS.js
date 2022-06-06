

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { getAzWebAppConfig } = require("../../../plugins/nodeSrc/webAppConfig")

//AzNodeRest
module.exports = async function (item) {
    let returnObject = new returnObjectInit(item,__filename.split('/').pop())

    let configs =  await getAzWebAppConfig(item)
    //let configs = await AzNodeRest(`${item.id}/config/web?`,'2018-11-01')
  
    var minTls = configs?.properties?.minTlsVersion

    if (minTls == "1.2") {
        returnObject.isHealthy=true 
    }

   
//console.log(stashOrig)
returnObject.metadata={minTls} 
return returnObject

}


