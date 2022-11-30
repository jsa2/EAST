
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
    
item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
var subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName

var {apiversion} = getProviderApiVersion(item.id)
var s = item.id.split('/')[1] + "/" +item.id.split('/')[2]

/* var s = "subscriptions/3539c2a2-cd25-48c6-b295-14e59334ef1c/providers/microsoft.insights/diagnosticSettings"
item = await AzNodeRest(`/${s}`,'2021-05-01-preview')
 */

try {

    var data = await AzNodeRest(`/${s}/providers/Microsoft.Security/securityContacts`,'2020-01-01-preview')

    var matchK = JSON.stringify(data)
    console.log(matchK)
    returnObject.isHealthy=false
    if ( matchK.match('"alertNotifications":{"state":"On"') && matchK.match('"notificationsByRole":{"state":"On"')  ){
        returnObject.isHealthy=true
    } 

    returnObject.metadata = {SecurityContactDetails:JSON.stringify(matchK)}
    //console.log(stashOrig)
    returnObject.name = subName
    return returnObject

} catch (error) {
    returnObject.isHealthy="review"
    returnObject.metadata = {message:"Unable to process this type of sub", error}
    return returnObject
}
   




}

