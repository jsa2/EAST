
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())
var subName = JSON.parse(process.env.subs).find(m => m.id == item.name)?.subName


if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)
var s = item.id.split('/')[1] + "/" +item.id.split('/')[2]
var {value} = await AzNodeRest(`/${s}/providers/Microsoft.Security/pricings`,'2018-06-01')
   const settings= value.map(item => {
       var {name} = item
        return {
            name,
            tier:item.properties?.pricingTier
        }
    }) || ""


    returnObject.name = subName

//returnObject.metadata = {settings:JSON.stringify(settings),subName }
returnObject.metadata = {settings,subName }
//console.log(stashOrig)

return returnObject

}

