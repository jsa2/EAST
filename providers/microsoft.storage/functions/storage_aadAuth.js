

const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { checkRoles } = require("../../../plugins/nodeSrc/listRoles")
const { azNodeRestRef } = require("../../../plugins/nodeSrc/nodeRestRef")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
let scope = item.id.split('/')


// get top level AAD authorization
let {roles} =await checkRoles(scope[2])
let AzureRbacRoles = roles.filter(sd => sd?.properties?.roleName.match('Storage') && !sd?.properties?.roleName.match('Classic') ).map(d => {
    return {
        id:d.name,
        display:d.properties.roleName
    }
}) || []


let assignments = JSON.stringify(await AzNodeRest(`${item.id}/providers/Microsoft.Authorization/roleAssignments?roleAssignments?$filter=atScope()`,"2021-04-01-preview"))


const AADRolesInUseTopLevel = AzureRbacRoles.filter(c => assignments.match(c.id))
if (AADRolesInUseTopLevel.length > 0) {
    returnObject.isHealthy=true
    returnObject.metadata = AADRolesInUseTopLevel
    return returnObject
}

returnObject.metadata={AADRolesInUseTopLevel}

return returnObject

}