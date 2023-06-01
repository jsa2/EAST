
const { AzNodeRest } = require("./east")
const { getGraphToken } = require("./getToken")
const { graph } = require("./graph")
const { checkRoles } = require("./listRoles")


async function iterateMI(item) {


    if (!item?.identity) {
        // If no identity, return undefined
        return undefined
    }

    let subs = JSON.parse(process.env.subs)

    /*  let subs = [
         {
           id: "3539c2a2-cd25-48c6-b295-14e59334ef1c",
           subName: "Microsoft Azure Sponsorship",
         },
       ] */

    let graphToken = await getGraphToken()


    item?.identity

    let identityList = []

    if (item?.identity?.userAssignedIdentities) {
        identityList = Object.keys(item?.identity?.userAssignedIdentities)?.map(s => s = { principal: item?.identity?.userAssignedIdentities[s]?.principalId })
    }


    identityList.push({ principal: item?.identity?.principalId })


    let userAssigned
    var rls = []


    for await (let identity of identityList) {

        console.log(identity)

        let roles = await graph(graphToken, `servicePrincipals/${identity?.principal}/appRoleAssignments`)
        identity.graphRoles = []
        identity.azureRoles = []

        for await (role of roles) {

            let resourceSPN = await graph(graphToken, `servicePrincipals/${role.resourceId}`)
            let matchingRole = resourceSPN?.appRoles?.find((graphRole) => graphRole.id == role.appRoleId)

            if (!matchingRole) {
                console.log()
            }
            identity.graphRoles.push(matchingRole)
        }


        console.log()

        for await (let sb of subs) {

            // get existing roleChecks
            let { roles } = await checkRoles(sb)
            //if (roles) {require('fs').writeFileSync('roles.json',JSON.stringify(roles))}
            //console.log(r)
            let opt = {
                url: `https://management.azure.com/subscriptions/${sb.id}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter=assignedTo('${identity?.principal}')`
            }
            //  console.log(opt.url)
            let { value } = await AzNodeRest(undefined, undefined, undefined, opt)
            if (value.length > 0) {
                value.map((role) => {

                    console.log(role.id)
                    let roleMatch = roles.find((match) => match.id == role?.properties.roleDefinitionId)
                    role.RoleName = roleMatch?.properties?.roleName || 'no match'
                })

                identity.azureRoles.push({ role: value })
            }


        }

    }

    return identityList


}

module.exports={iterateMI}
