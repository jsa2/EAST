


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { azNodeRestRef, azNodeRestRefDyn } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())


var {apiversion} = getProviderApiVersion(item.id)

var {value:pipelines} = await AzNodeRest(`${item.id}/pipelines?`,apiversion)

let promiseR = []
let noInputs = []
// Map linked services and datasets
var throttleCount = 1
pipelines.map(svc => {

    delete svc.etag
    svc.properties?.activities.map(dataSource => {
        var inAndOnut = [] 
        if (dataSource?.inputs && dataSource?.outputs) {
            dataSource?.inputs.map(item => inAndOnut.push(item))
            dataSource?.outputs.map(item => inAndOnut.push(item))
            inAndOnut.map(dataSet => {
                throttleCount++
                console.log(dataSet)
                promiseR.push(azNodeRestRefDyn(`${item.id}/datasets/${dataSet?.referenceName}`,apiversion,undefined,undefined,undefined,{pipeline:svc.name,activity:dataSource?.name,dataSource:dataSet?.referenceName},throttleCount))
            })
        } else if (dataSource?.linkedServiceName) {
            noInputs.push({reference:{pipeline:svc.name,activity:dataSource?.linkedServiceName?.referenceName,dataSource:"no pipeline input/output"}})
        }
       if (dataSource.typeProperties?.dataset?.referenceName) {
            //console.log(dataSource)
            promiseR.push(azNodeRestRefDyn(`${item.id}/datasets/${dataSource.typeProperties.dataset.referenceName}`,apiversion,undefined,undefined,undefined,
            {pipeline:svc.name,
            activity:dataSource?.name,
            dataSource:dataSource.typeProperties.dataset.referenceName},throttleCount))
        }
        
    })
})




let promiseR2 = []
const links = await Promise.all(promiseR)
noInputs.map(item => links.push(item))
links.map(svcLink => {
    
    if (svcLink?.data?.properties?.linkedServiceName?.referenceName) {
        promiseR2.push(azNodeRestRefDyn(`${item.id}/linkedservices/${svcLink?.data?.properties?.linkedServiceName?.referenceName}`,apiversion,undefined,undefined,undefined,svcLink.reference,throttleCount))
    } else {
        promiseR2.push(azNodeRestRefDyn(`${item.id}/linkedservices/${svcLink?.reference?.activity}`,apiversion,undefined,undefined,undefined,svcLink.reference,throttleCount))
    }

})
//
const links2 = await Promise.all(promiseR2)

pipelines.map(pipeline => {
    delete pipeline.properties; delete pipeline.id; delete pipeline.type
    pipeline.LinkdSvcToActivity = links2.filter(p => p?.reference?.pipeline == pipeline.name).map(s => {
     
        let links = s.data.name
        if (JSON.stringify(links).match('encrypted')) { 
            returnObject.isHealthy=false
            
            links.encryptedCredential = `${s.data.properties.typeProperties.encryptedCredential.substring(0,10)}...REDACTED`

            return {
                failedCredential: true,
                pipeLine:`${s.reference.pipeline}:${s.reference.activity}:${s.data.name}`,
                links
                    }
        } else 
        return {
            failedCredential: false,
            pipeLine:`${s.reference.pipeline}:${s.reference.activity}:${s.data.name}`,
            links
                } 
    })
    console.log()
})

returnObject.isHealthy="manual"
returnObject.metadata = {pipelines}
//console.log(stashOrig)

return returnObject

}


