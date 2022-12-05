
// Creates a new map, no need to push the results
/* 
test(require('../content.json'))

 */


module.exports = async function (src)  { 

       
    let composite = src.find(s => s?.controlId == "adminsCa" ) 

    if (!composite) {
        return;
    }

    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity") ).filter( s=>s?.metadata?.principalId?.principalId !== undefined) 

    processed.map( sd => {
       
       composite?.metadata?.results?.forEach( s => {

       if ( s?.value.find(f => f?.oid == sd?.metadata?.principalId?.principalId)) {
        sd?.metadata.roles.push({
            aadRole:s?.refInfo
        })
       }

       })
        
      
     
    } )

   
    return;

   

}





async function test (src) { 


    let composite = src.find(s => s?.controlId == "adminsCa" ) 

    if (!composite) {
        return;
    }

    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity") ).filter( s=>s?.metadata?.principalId?.principalId !== undefined) 

    processed.map( sd => {
       
       composite?.metadata?.results?.forEach( s => {

       if ( s?.value.find(f => f?.oid == sd?.metadata?.principalId?.principalId)) {
        sd?.metadata.roles.push({
            aadRole:s?.refInfo
        })
       }

       })
        
      
     
    } )

   
    return;
}
