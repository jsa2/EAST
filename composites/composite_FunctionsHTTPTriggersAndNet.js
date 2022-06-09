
// Creates a new map, no need to push the results

test(require('../content.json'))

async function test (src)  { 

        
    let processed = src.filter(s => s?.controlId !== undefined && s?.metadata?.bindings !== undefined).filter(s => s.controlId.toLowerCase().match("listf") ) 
    let composite = src.filter(s => s?.controlId !== undefined).filter(s => s.controlId.toLowerCase().match("networkrest"))
    
    console.log(processed,composite)

    processed.map( sd => {
       
        let hasNoHTTP =composite.find(s => s.resource == sd.resource && s.metadata)
        console.log(hasNoHTTP)

    } )

   

}

module.exports = async function (src)  { 

        
    let processed = src.filter(s => s?.controlId !== undefined).filter(s => s.controlId.toLowerCase().match("list") ) 
    let composite = src.filter(s => s?.controlId !== undefined).filter(s => s.controlId.toLowerCase().match("networkrest"))
    
    console.log(processed,composite)

    processed.map( sd => {
       
        composite.forEach(a => {
           let hasNoHTTPTriggers =  a.metadata.accessPolicy.filter(b => b.id == sd.metadata.principalId.principalId )

        })
  
    } )

   

}


