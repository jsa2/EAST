
// Creates a new map, no need to push the results

module.exports = async function (src) { 


    const processed = src.filter(s => s.controlId == "networkRestrictions" ) 
    //let s = new responseSchema(item, {Category:"Protection",Description:"Review MDC alerts on this resource"})
    

    let returnable = [] 
    processed.forEach( sds => {
        var sd =new newObjectCreater(sds)

        if (JSON.stringify(sd?.metadata?.scmIpSecurityRestrictions).match('Allow all access')) {
            sd.isHealthy = false
        }

      
        sd.controlId = "composite_WebAppScmIpSecurityRestrictions"
        sd.Description = "Review WebApps SCM endpoint restrictions \r\n"
        returnable.push(sd)
        
    } )

   
    return returnable
}

function newObjectCreater (data) {
    this.data={}
   Object.keys(data).map(f => this.data[f] = data[f])
    return this.data
}

