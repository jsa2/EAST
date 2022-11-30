const { default: axios } = require("axios")
const { decode } = require("jsonwebtoken")
const { getBasicAuthStatus, getMFAStatus } = require("../../../plugins/nodeSrc/aadHelpers")
const { getAADIamToken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")

//AzNodeRest
module.exports = async function (item) {

var token = await getAADIamToken()


var {oid} = decode(token)
var data 
if (   process.env.checkMFA == 'true') {
    data = await getBasicAuthStatus(oid)
}


let returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.name = item.name
returnObject.id = item.name

if (data?.appliedPol.length == 0) {
    returnObject.isHealthy=false
}
else {
    returnObject.isHealthy=true
}

returnObject.metadata = {result:data || "no result available process.env.checkMFA:false"}

return returnObject

}
