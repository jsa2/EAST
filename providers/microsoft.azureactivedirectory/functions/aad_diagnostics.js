

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let logsToInspect = [
    'ManagedIdentitySignInLogs',
    'ServicePrincipalSignInLogs',
    'AuditLogs',
    'SignInLogs',
    'NonInteractiveUserSignInLogs'
]

var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.name = item.name
returnObject.id = item.name
item.id = `/${item.name}/providers/Microsoft.Authorization`

var errorPropagation 
let diagnostics = await AzNodeRest(`/providers/microsoft.aadiam/diagnosticSettings`,`2017-04-01-preview`).catch((error) => {
    returnObject.metadata = JSON.stringify(error)
    errorPropagation = error
})

if (errorPropagation) {
    returnObject.isHealthy="review"
}

if (!errorPropagation) {
    returnObject.isHealthy=true
    var results = logsToInspect.map(cat => {
        return JSON.stringify(diagnostics).match(`"${cat}","categoryGroup":null,"enabled":true`)[0] 
    })

    if (JSON.stringify(results).match('enabled":false')) {
        returnObject.isHealthy=false
    }

}

returnObject.metadata = {results:results || errorPropagation}
//console.log(stashOrig)

return returnObject

}


            