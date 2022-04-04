

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
let AzureRbacRoles = roles.filter(sd => sd?.properties?.description.match('Azure Event Hubs')).map(d => {
    return {
        id:d.name,
        display:d.properties.roleName
    }
})
let assignments = JSON.stringify(await AzNodeRest(`${item.id}/providers/Microsoft.Authorization/roleAssignments?roleAssignments?$filter=atScope()`,"2021-04-01-preview"))


const AADRolesInUseTopLevel = AzureRbacRoles.filter(c => assignments.match(c.id))
if (AADRolesInUseTopLevel.length > 0) {
    returnObject.isHealthy=true
    returnObject.metadata = AADRolesInUseTopLevel
    return returnObject
}

// Map linked services and datasets
var throttleCount = 1
let hubsArr = []

let {value:hubs} = await AzNodeRest(`${item.id}/eventhubs?$top=100`,'2017-04-01')

hubs.map(hub => hubsArr.push(azNodeRestRef(`${item.id}/namespaces/${hub.name}/providers/Microsoft.Authorization/roleAssignments?roleAssignments?$filter=atScope()`,"2021-04-01-preview",undefined,undefined,undefined,hub,throttleCount)))

let subAssigments = JSON.stringify(await Promise.all(hubsArr))

const AADRolesInUse = AzureRbacRoles.filter(c => subAssigments.match(c.id))
if (AADRolesInUse.length > 0) {
    returnObject.isHealthy=true
    returnObject.metadata = AADRolesInUse
}

returnObject.metadata={AADRolesInUse}

return returnObject


}


