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

if (   process.env.checkMFA == 'true') {
    var data = await getBasicAuthStatus(oid)
}


var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.name = item.name
returnObject.id = item.name

if (item?.properties) {
    returnObject.isHealthy=false
}
else {
    returnObject.isHealthy=true
}

returnObject.metadata = {result:data || "no result available process.env.checkMFA:false"}

return returnObject

}
