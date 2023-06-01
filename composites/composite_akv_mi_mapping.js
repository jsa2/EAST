
// Creates a new map, no need to push the results
/* 
test(require('../content.json')) */




module.exports = async function (src) { 


    let filtered = src.filter(s => s?.controlId !== undefined)
    .filter(s => s.controlId.toLowerCase().match("managedidentity") )
    .filter( s=>s?.metadata?.identityList !== undefined) 
    let composite = src.filter(s => s?.controlId == "KeyVault_accessPolicies" )
    .filter( k=>k.metadata?.accessPolicy.length > 0) 
    
 

    for (processed of filtered) {

        processed?.metadata?.identityList?.map( sd => {
       
            sd.linkedKeyVaults = []
    
            composite.forEach(a => {
               let accessPolicy =  a.metadata.accessPolicy.filter(b => b.id == sd.principal )
               let viaAzureRBAC =  sd?.azureRoles?.map(b => b.role?.filter(c => c?.properties?.scope?.toLowerCase() == a?.id)).flat()
               

               if (accessPolicy.length > 0) {
                sd.linkedKeyVaults.push({
                    keyVault: a?.name,
                    accessPolicy
                })
               }

               if (viaAzureRBAC.length > 0) {
                viaAzureRBAC.forEach(kv => {
                    sd.linkedKeyVaults.push({
                        keyVault: a?.name,
                        rbac:kv?.RoleName
                    })
                })
                
               }
               
    
            })
      
        } )
    

    }
    
    return;

}





async function test (src) { 


    let filtered = src.filter(s => s?.controlId !== undefined)
    .filter(s => s.controlId.toLowerCase().match("managedidentity") )
    .filter( s=>s?.metadata?.identityList !== undefined) 
    let composite = src.filter(s => s?.controlId == "KeyVault_accessPolicies" )
    .filter( k=>k.metadata?.accessPolicy.length > 0) 
    
 

    for (processed of filtered) {

        processed?.metadata?.identityList?.map( sd => {
       
            sd.linkedKeyVaults = []
    
            composite.forEach(a => {
               let accessPolicy =  a.metadata.accessPolicy.filter(b => b.id == sd.principal )
               let viaAzureRBAC =  sd?.azureRoles?.map(b => b.role?.filter(c => c?.properties?.scope?.toLowerCase() == a?.id)).flat()
               

               if (accessPolicy?.length > 0) {
                sd.linkedKeyVaults.push({
                    keyVault: a?.name,
                    accessPolicy
                })
               }

               if (viaAzureRBAC?.length > 0) {
                viaAzureRBAC.forEach(kv => {
                    sd.linkedKeyVaults.push({
                        keyVault: a?.name,
                        rbac:kv?.RoleName
                    })
                })
                
               }
               
    
            })
      
        } )
    

    }
    
    return;

}
