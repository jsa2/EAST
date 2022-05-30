
// Creates a new map, no need to push the results

/* test(require('../content.json')) */




module.exports = async function (src) { 


    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity") ).filter( s=>s?.metadata?.principalId) 
    let composite = src.filter(s => s.controlId == "KeyVault_accessPolicies" ) 
    
    processed.map( sd => {

        sd.metadata.roles.keyVaultLinks = composite.filter( c => {

            let innerM = c.metadata.accessPolicy.filter(principal => principal.id == sd.metadata.principalId?.principalId)
            return innerM || "no matches in keyVaults"
        } )
        
    
        
    } )

   
    return;
}




async function test (src) { 


    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity") ).filter( s=>s?.metadata?.principalId) 
    let composite = src.filter(s => s.controlId == "KeyVault_accessPolicies" ) 
    
    processed.map( sd => {

        sd.metadata.roles.keyVaultLinks = composite.filter( c => {

            let innerM = c.metadata.accessPolicy.filter(principal => principal.id == sd.metadata.principalId?.principalId)
            return innerM || "no matches in keyVaults"
        } )
        
    
        
    } )

   
    return;
}