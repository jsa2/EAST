const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { graph } = require("../../../plugins/nodeSrc/graph")
const { checkRoles } = require("../../../plugins/nodeSrc/listRoles")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
module.exports = async function (item) {

  
    var graphToken = await getGraphToken()
    var returnObject = {}
    var returnObject = new returnObjectInit(item,__filename.split('/').pop())


    if (!item?.id.match('/microsoft.compute/virtualmachines') ||item?.id.match('/extensions') ) {
        returnObject.metadata = {}
        returnObject.isHealthy="notApplicable"
        return returnObject
    }

    var subs = JSON.parse(process.env.subs)

    var keyToCheck = item?.identity
    item.properties
    if (keyToCheck) {
        returnObject.isHealthy=true
    
    let userAssigned
    var rls = []

    var g
    // Handle situation where user assigned identity is removed or not found in graph
    try {
        if (item?.identity?.userAssignedIdentities) {
            userAssigned = Object.keys(item?.identity?.userAssignedIdentities)[0]
            let sd = await AzNodeRest(userAssigned,'2018-11-30')
            item.identity.principalId = sd?.properties?.principalId
            g =await graph(graphToken,`servicePrincipals/${item?.identity.principalId}/appRoleAssignments`)
    
        }
       
    } catch(error) {
        returnObject.isHealthy = "not applicable",
        returnObject.metadata={error}
        return returnObject
    }
   
    if (g.length > 0) {
        for await (graphRole of g) {
           
            
          var ss=  await graph(graphToken,`servicePrincipals/${graphRole.resourceId}`)
          var matchingRole = ss.appRoles.find((role) => { return graphRole.appRoleId == role.id})

          if (!matchingRole?.displayName) {
            console.log()
        }
         

          rls.push({role:`AppRole: ${matchingRole?.displayName}`})
          console.log('rls',rls)
        }
    }

    
    for await (sb of subs) {

            // get existing roleChecks
            var {roles} = await checkRoles(sb)
            //if (roles) {require('fs').writeFileSync('roles.json',JSON.stringify(roles))}
            //console.log(r)
            var opt = {
                url:`https://management.azure.com/subscriptions/${sb.id}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter=assignedTo('${item?.identity.principalId}')`
            }
          //  console.log(opt.url)
            var {value} = await AzNodeRest(undefined,undefined,undefined,opt)
            if (value.length > 0) {
               value.map((role) => {
                
                console.log(role.id)
                var roleMatch = roles.find((match) => match.id == role?.properties.roleDefinitionId)
                role.RoleName = roleMatch?.properties?.roleName || 'no match'
                })
                
                rls.push({role:value})
            }
          

        }

       

     
    }
    else {
        returnObject.isHealthy=false
    }

    returnObject.name = item.name
    returnObject.id = item.id
    returnObject.metadata = {principalId:keyToCheck|| 'no managed identity',roles:rls ||'no roles for managed identity'}

    return returnObject
}
