
// Creates a new map, no need to push the results

//test(require('../content.json'))

async function test (src)  { 

        
    let processed = src.filter(s => s?.controlId !== undefined && s?.metadata?.bindings)
    .filter(s => s.controlId.toLowerCase().match("listf") )
    .filter(s => !JSON.stringify(s?.metadata?.bindings).match('http')) 
    let composite = src.filter(s => s?.controlId !== undefined).filter(s => s.controlId.toLowerCase().match("networkrest"))
    
    console.log(processed,composite)

    processed.map( sd => {
       
        let hasNoHTTP =composite.find(s => s.resource == sd.resource && s.metadata)
        
        if (hasNoHTTP) {
            sd.isHealthy = true
        }

    } )

   

}

module.exports = async function (src) { 

        
    let composite = src.filter(s => s?.controlId !== undefined && s?.metadata?.bindings)
    .filter(s => s.controlId.toLowerCase().match("listf") )
    .filter(s => !JSON.stringify(s?.metadata?.bindings).match('http')) 
    let processed = src.filter(s => s?.controlId !== undefined).filter(s => s.controlId.toLowerCase().match("networkrest"))
    
    console.log(processed,composite)

    processed.map( sd => {
       
        let hasNoHTTP =composite.find(s => s.resource == sd.resource && s.metadata)
        
        if (hasNoHTTP) {
            sd.isHealthy = true
        }
        
    } )

    return;
   

}