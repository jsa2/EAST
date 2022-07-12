const { AzNodeRest } = require("./east");


 async function diagReview (item,categories,requireAll) { 

    const diagnostics = await AzNodeRest(`${item.id}/providers/microsoft.insights/diagnosticSettings?`,'2021-05-01-preview')
    
    let isOK = false
    let results = categories.map(key => {
        let subR = {
            key,
            isEnabled:diagnostics?.value.find(v => v?.properties?.logs.find(log => (log?.category == key || log.categoryGroup == key) && log?.enabled == true)) || "failCheck"
        }

        if (subR.isEnabled.toString().length > 10 && isOK ==false ) {
            isOK=true
        }

        return subR

    })




    if (requireAll) {
        if (JSON.stringify(results).match('failCheck')) {
            isOK=false
        }
    }

    results.isHealthy=isOK
    return results
}

module.exports={diagReview}


