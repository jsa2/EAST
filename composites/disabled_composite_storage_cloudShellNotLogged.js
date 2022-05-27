
// Creates a new map, no need to push the results

module.exports = async function (src) { 


    let processed = src.filter(s => s.controlId == "storage_cloudShell" ) 
    let composite = src.filter(s => s.controlId == "ADF_pipeLineRuns" ) 
    //let s = new responseSchema(item, {Category:"Protection",Description:"Review MDC alerts on this resource"})
    

    let returnable = [] 
    processed.map( sd => {

        let missingAuditLogs = ""

        sd.Description = "missed"
        //returnable.push(sd)
        
    } )

   
    return;
}


