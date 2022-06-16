
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")

//AzNodeRest
module.exports = async function (item) {
    
item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName

var {apiversion} = getProviderApiVersion(item.id)
var s = item.id.split('/')[1] + "/" +item.id.split('/')[2]

/* var s = "subscriptions/3539c2a2-cd25-48c6-b295-14e59334ef1c/providers/microsoft.insights/diagnosticSettings"
item = await AzNodeRest(`/${s}`,'2021-05-01-preview')
 */

try {var {value} = await AzNodeRest(`/${s}/providers/microsoft.insights/diagnosticSettings`,'2021-05-01-preview')


var AdministrativeLogs = value.find((m) => m.properties.logs.find(settings => settings.category =="Administrative" && settings.enabled == true )) || "Not enabled"
var SecurityLogs = value.find((m) => m.properties.logs.find(settings => settings.category =="Security" && settings.enabled == true )) || "Not enabled"
//console.log(sd)
returnObject.isHealthy=false
if ( typeof(AdministrativeLogs) === "object" && typeof(SecurityLogs) === "object"  ){
    returnObject.isHealthy=true
} else {
   
}

returnObject.name = subName
returnObject.metadata = {subName,AdministrativeLogs:JSON.stringify(AdministrativeLogs),SecurityLogs:JSON.stringify(SecurityLogs)}
//console.log(stashOrig)

return returnObject
} catch(error) {

    returnObject.isHealthy="review"
    returnObject.metadata = {message:"Unable to process this type of sub", error}
    return returnObject
}


}

