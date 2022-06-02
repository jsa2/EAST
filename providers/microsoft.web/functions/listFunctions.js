

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { erroResponseSchema } = require("../../../plugins/nodeSrc/functionResponseSchema")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { checkDoesItApply, checkDoesItApplyFn } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const aadAuth = require("./aadAuth")


//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var {apiversion} = getProviderApiVersion(item.id)

if (item.id.match('honeypot')) {
    console.log()
}
var skip = checkDoesItApplyFn(item,returnObject)
if (skip) {
    return skip
}

returnObject.isHealthy=true

var orig = item

try {item = await AzNodeRest(`${item.id}/functions`,apiversion)} catch(error){
    returnObject.metadata=error
    return returnObject
}

var checkForAuth = false

var bindings = item?.value.map(fn => {
    var anonymous = fn?.properties?.config?.bindings.filter(s => s.type == "httpTrigger" && s.authLevel =="anonymous" ) 
    if (anonymous.length > 0) {
        checkForAuth = true
    }
    return {
     name:fn.name,
     full:fn?.properties?.config?.bindings,
     bindings:fn?.properties?.config?.bindings.map((binding) => binding.type), 
     bindingsAuth:fn?.properties?.config?.bindings.map((binding) => binding.authLevel), 
     anonymous,
     id:fn.id  
    }
});

if (checkForAuth) {
 var {metadata:aadAuthEnabled} = await aadAuth(orig)
 var functionAppScaleLimit = await AzNodeRest(`${orig.id}/config/web?`,apiversion)
 console.log(functionAppScaleLimit?.properties?.functionAppScaleLimit)
 var extended = {
    functionAppScaleLimit:functionAppScaleLimit?.properties?.functionAppScaleLimit,
    aadAuthEnabled
 }
 if (extended.functionAppScaleLimit == 0 || aadAuthEnabled.result == "no aad auth" ) {
     returnObject.isHealthy=false
 }
}


returnObject.metadata = {bindings,extended:extended || "Not applicable"}

return returnObject

}


            