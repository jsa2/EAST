

const { getAADCAPol } = require("../../../plugins/nodeSrc/aadHelpers")
const { erroResponseSchema } = require("../../../plugins/nodeSrc/functionResponseSchema")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.isHealthy=true

let baseline
try {
baseline = await enhance(returnObject)
} catch(error) {
    returnObject.metadata={error}
    returnObject.isHealthy="not applicable"
    return returnObject
}

Object.keys(baseline).map(key => {
    if( baseline[key]?.details ) {
        console.log(baseline[key]?.details )
        baseline[key].details = JSON.stringify(baseline[key].details)
    }   
})




returnObject.metadata=baseline 

return returnObject

}


async function enhance (returnObject) {
    let o = await getAADCAPol()
    
let controlKeyWord = new RegExp('Mfa|Block')
let controlKeyWord2 = new RegExp('Mfa|RequireCompliantDevice|RequireDomainJoinedDevice')

let session=  o.find(f => f?.details?.SessionControls)

let blockLegacy= o.filter(f => f?.details?.Conditions && !f?.details?.SessionControls)
.filter(f => JSON.stringify(f.details?.Conditions?.Users.Include).match('Users') )
.find(f => JSON.stringify(f.details?.Conditions?.Users?.Include).match('All') && JSON.stringify(f.details.Controls).match(controlKeyWord) && JSON.stringify(f.details?.Conditions?.Applications?.Include).match('All') && f.details?.EnforceAllPoliciesForEas == true && 
f?.details?.IncludeOtherLegacyClientTypeForEvaluation == true )

let mfa=  o.filter(f => f?.details?.Conditions && !f?.details?.SessionControls)
.filter(f => JSON.stringify(f.details?.Conditions?.Users.Include).match('Users') )
.find(f => JSON.stringify(f.details?.Conditions?.Users?.Include).match('All') && JSON.stringify(f.details.Controls).match(controlKeyWord2) && JSON.stringify(f.details?.Conditions?.Applications?.Include).match('All') )

if (!session || !blockLegacy || !mfa) {
returnObject.isHealthy = false
}

return {blockLegacy,mfa,session}
}

