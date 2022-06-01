
// Creates a new map, no need to push the results

/* test(require('../content.json'))
 */



module.exports = async function (src)  { 

        
    let processed = src.filter(s => s?.controlId !== undefined).filter(s => s.controlId.toLowerCase().match("managedidentity") ).filter( s=>s?.metadata?.principalId?.principalId !== undefined) 
    let composite = src.filter(s => s?.controlId == "KeyVault_accessPolicies" ).filter( k=>k.metadata?.accessPolicy.length > 0) 
    
    console.log(processed,composite)

    processed.map( sd => {
       
        sd.metadata.linkedKeyVaults = []

        composite.forEach(a => {
           let accessPolicy =  a.metadata.accessPolicy.filter(b => b.id == sd.metadata.principalId.principalId )

           if (accessPolicy.length > 0) {
            sd.metadata.linkedKeyVaults.push({
                keyVault: a?.name,
                accessPolicy
            })
           }

        })
  
    } )

   

}





async function test (src) { 


    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity") ).filter( s=>s?.metadata?.principalId?.principalId !== undefined) 
    let composite = src.filter(s => s.controlId == "KeyVault_accessPolicies" ).filter( k=>k.metadata?.accessPolicy.length > 0) 
    
    processed.map( sd => {
       
        sd.kvLinks = []

        composite.forEach(a => {
           let accessPolicy =  a.metadata.accessPolicy.filter(b => b.id == sd.metadata.principalId.principalId )

           if (accessPolicy.length > 0) {
            sd.kvLinks.push({
                keyVault: a?.name,
                accessPolicy
            })
           }

        })
  
    } )

   
    return;
}
