

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { runner } = require("../../../plugins/pluginRunner")
const { azNodeRestRef, azNodeRestRefDyn } = require("../../../plugins/nodeSrc/nodeRestRef")


//AzNodeRest
module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
let states2 = await runner(`az policy state list --resource ${item.id} --filter "ComplianceState eq 'NonCompliant' or ComplianceState eq 'Compliant' " `)
/* let states = await runner(`az policy state list --resource ${item.id} --filter "policyAssignmentId eq '/providers/Microsoft.Management/managementGroups/033794f5-7c9d-4e98-923d-7b49114b7ac3/providers/Microsoft.Authorization/policyAssignments/9683ccf416114d6f9761a44' and policyDefinitionId eq '/providers/Microsoft.Authorization/policyDefinitions/233a2a17-77ca-4fb1-9b6b-69223d272a44'"`)

let s = states[3].odataContext
console.log(s)
 */



returnObject.isHealthy="manual"
let promArra = []
let c = 0
states2.map( it => {
 c++
    let opt = {
        method:"post",
        url:`https://management.azure.com${item.id}/providers/Microsoft.PolicyInsights/policyStates/latest/queryResults?api-version=2019-10-01&$filter=policyAssignmentId eq '${it.policyAssignmentId}' and policyDefinitionId eq '${it.policyDefinitionId}'&$expand=components($filter=complianceState eq 'NonCompliant' and type ne '*')`,
        data:{}
    }
    promArra.push(azNodeRestRefDyn(undefined,undefined,undefined,opt,undefined,undefined,c))
})


try {
    let componentsList = await (await Promise.all(promArra)).map(comp => {

        let {description,displayName} =require('../../../plugins/other/defaultPolicydef.json').find(f => f.id.toLowerCase().match(comp?.value[0].policyDefinitionId.toLowerCase()))
        let r = {
            description,
            displayName,
            policyDefinitionId:comp?.value[0].policyDefinitionId,
            policyDefinitionReferenceId:comp?.value[0].policyDefinitionReferenceId,
            components:comp?.value[0].components
        }
        return r
    }) || {}
    
    if (JSON.stringify(componentsList).toLowerCase().match('noncompliant')) {
        returnObject.isHealthy=false
    }

    returnObject.metadata=componentsList  || {}

} catch (error) {
    returnObject.isHealthy = false
    returnObject.metadata = error
    return returnObject
}




return returnObject

}


