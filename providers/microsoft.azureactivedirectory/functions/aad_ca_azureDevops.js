

const { decode } = require("jsonwebtoken")
const { getAzDevopsStatus } = require("../../../plugins/nodeSrc/aadHelpers")
const { erroResponseSchema } = require("../../../plugins/nodeSrc/functionResponseSchema")
const { getAADIamToken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
var tkn =decode(await getAADIamToken())



let returnObject = new returnObjectInit(item,__filename.split('/').pop())

let azd
try {
   azd= await getAzDevopsStatus(tkn.oid)
} catch(error) {
    returnObject.metadata={error}
    returnObject.isHealthy="not applicable"
    return returnObject
}
//console.log(stashOrig)
returnObject.metadata=azd
returnObject.isHealthy="review"
return returnObject

}


