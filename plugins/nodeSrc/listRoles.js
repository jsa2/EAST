const { AzNodeRest } = require("./east")


// declare existing ahead of time, so if it's required later it will be in memory
var existingRoleDef = []

async function checkRoles (sb) {
if (!sb?.id) {
console.log()
}
    var opt = {
        url:`https://management.azure.com/subscriptions/${sb.id|| sb}/providers/Microsoft.Authorization/roleDefinitions?api-version=2015-07-01&`
    }
    var results = existingRoleDef.find((item) => {
    //    console.log(item.sb)
        return item.sb == sb
    }
        )
    if ( !results ) {

        var roles = await AzNodeRest(undefined,undefined,undefined,opt)
        var addTo ={
            sb,
            roles:roles?.value
        }
        existingRoleDef.push(addTo)
        //console.log('pushed', sb)
        return addTo
    } else {
        return results
    }

   

}

module.exports={checkRoles}
