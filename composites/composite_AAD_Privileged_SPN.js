
// Creates a new map, no need to push the results


/* sd(require('../content.json'))
 */
async function sd (src) { 


    let spn = src.find(s => s.controlId == "adminsCa" ) 
    
            var sd =new newObjectCreater(spn)
            sd.isHealthy = true
            let spns = []
            sd.metadata.results.map(s => s.value.filter(s => s.object.match('servicePrincipal')).map(s => spns.push(`${s.role} - ${s.object}`)) )
            sd.controlId = "AAD_Privileged_SPN"
            sd.Description = "Ensure Service Principals are not in privilged Azure AD roles unless justified"
            sd.metadata = spns
        
    
       
        return sd
    }


module.exports = async function (src) { 


let spn = src.find(s => s.controlId == "adminsCa" ) 

if (!spn) {
    return;
}
var sd =new newObjectCreater(spn)
sd.isHealthy = true
let spns = []
sd.metadata.results.map(s => s.value.filter(s => s.object.match('servicePrincipal')).map(s => spns.push(`${s.role} - ${s.object}`)) )
sd.controlId = "AAD_SPNInAADRole"
sd.Description = "Ensure Service Principals are not in privilged Azure AD roles unless justified"
sd.metadata = spns

if (spns.length > 0) {
    sd.isHealthy ="review"
}

return sd
}

function newObjectCreater (data) {
    this.data={}
   Object.keys(data).map(f => this.data[f] = data[f])
    return this.data
}

