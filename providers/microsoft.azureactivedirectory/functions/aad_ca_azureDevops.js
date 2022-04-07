

const { decode } = require("jsonwebtoken")
const { getAzDevopsStatus } = require("../../../plugins/nodeSrc/aadHelpers")
const { getAADIamToken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var tkn =decode(await getAADIamToken())
let azd = await getAzDevopsStatus(tkn.oid)
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
returnObject.metadata=azd
returnObject.isHealthy="review"
return returnObject

}


