

const { default: axios } = require("axios")
const { randomUUID } = require("crypto")
const { decode } = require("jsonwebtoken")
const { axiosClient } = require("../../../plugins/nodeSrc/axioshelpers")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getAKStoken } = require("../../../plugins/nodeSrc/getToken")

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")


//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())


//var tkn = await runner('az account get-access-token --resource=6dae42f8-4368-4678-94ff-3960e28e3630 --query accessToken --output json')
var tkn = await getAKStoken()
let customOpt = {
    url:`https://${item.properties?.azurePortalFQDN}/api/v1/services?limit=200`,
    method:"get",
    timeout:2000,
    headers:{
        authorization: `Bearer ${tkn}`,
        'kubectl-session': randomUUID()
    }
}

try{
    const {data} = await axios(customOpt)
    console.log(data)
    returnObject.metadata=data
} catch (error) {
    //console.log(error )
    returnObject.metadata={error:error?.message}
}


returnObject.isHealthy="manual"
return returnObject

}


