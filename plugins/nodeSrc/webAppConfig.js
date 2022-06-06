/* //web app config is fetched at multiple stages, so it makes sense to cache the result.
 Composite would be the best place to handle it, but also given the use case somewhat cumber some */

const { AzNodeRest } = require("./east")

var waConfig

async function getAzWebAppConfig (item) {

    if (waConfig == undefined) {
        waConfig=[]
    }

    let conf = waConfig.find(s => s.id == item.id )

    if (!conf) {
        console.log('no cache entry for config of', item?.id)
        conf = await AzNodeRest(`${item.id}/config/web?`,'2018-11-01')
        waConfig.push(conf)
    } 
    

    return conf

}


module.exports={getAzWebAppConfig}


 