
// Creates a new map, no need to push the results

module.exports = async function (src) { 


    const processed = src.filter(s => s.controlId == "ADF_pipeLineRuns" ) 
    const old = src.filter(s => s.controlId == "ADF_pipeLineRuns" ) 
    //let s = new responseSchema(item, {Category:"Protection",Description:"Review MDC alerts on this resource"})
    

    let returnable = [] 
    processed.forEach( sds => {

        var sd =new newObjectCreater(sds)
        sd.isHealthy = true

        try {
            if (sd.metadata?.sqlInput.toLowerCase().match('select')) {
                sd.isHealthy = "review"
            }
        } catch (error) {
            console.log('not applicable for SQL statements')
        }
       
/* 
        delete sd.metadata.matchLikelySecrets
        delete sd.metadata.returnPw */
        console.log(old)
        sd.controlId = "composite_ADF_reviewSelectStatements"
        sd.Description = "Review pipelines activities with select statements for dynamic and user modifiable input"
        returnable.push(sd)
        
    } )

   
    return returnable
}

function newObjectCreater (data) {
    this.data={}
   Object.keys(data).map(f => this.data[f] = data[f])
    return this.data
}

