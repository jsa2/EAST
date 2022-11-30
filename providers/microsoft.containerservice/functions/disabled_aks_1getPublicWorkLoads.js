

const { default: axios } = require("axios")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
/* const { getAKStoken } = require("../../../plugins/nodeSrc/getToken") */
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
/* var token = await getAKStoken()
let customOpt = {
    url:`https://${item.properties?.azurePortalFQDN}/apis/apps/v2/deployments?limit=200`,
    method:"get",
    headers:{
        authorizaton: `Bearer ${token}`
    }
}

const deployments = await AzNodeRest(undefined,undefined ,undefined,customOpt)
 */
returnObject.metadata={} 
returnObject.isHealthy="manual"
return returnObject

}


