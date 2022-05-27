
const { default: axios } = require("axios")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { getToken, getGraphToken, getGraphTokenReducedScope } = require("../../../plugins/nodeSrc/getToken")
const { checkDoesItApply } = require("../../../plugins/nodeSrc/microsoftwebhelper")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const {argv} = require('yargs')
const { graph } = require("../../../plugins/nodeSrc/graph")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`

if (!argv.scanAuditLogs) {
    returnObject.isHealthy="manual"
    returnObject.metadata= {msg:"To enable the scan provide --scanAuditLogs option in the start. This item is synchronous and can take quite the long time"}
    return returnObject
}

var d1 = new Date (),
d2 = new Date ( d1 );

if ( typeof(argv.scanAuditLogs) == "number" ) {
    d2.setHours ( d1.getHours() - argv.scanAuditLogs );
} else {
    d2.setHours ( d1.getHours() - 24 );
}


// query is reduced to started (Need to investigate if this can cause gaps)
//var q = `eventTimestamp ge '${d2.toISOString()}'  and eventTimestamp le '${d1.toISOString()}'  and eventChannels eq 'Admin, Operation'`
var q = `eventTimestamp ge '${d2.toISOString()}'  and eventTimestamp le '${d1.toISOString()}'  and eventChannels eq 'Admin, Operation' and status eq 'Started'`
const data = await AzNodeRest(`${item.id.split('/providers/')[0]}/providers/Microsoft.Insights/eventtypes/management/values?$filter=${q}`,'2015-04-01')
let results = []
item.isHealthy=true
data.value.map(d => results.push(d))
if (data.nextLink) { 
    results.push(await axiosLoop(data.nextLink,results))
 }

/*  results.filter(is => !is.claims?.idtyp && is.caller !=='System')
    .filter( is =>  {
       if (  !is.claims?.["http://schemas.microsoft.com/claims/authnmethodsreferences"].match('mfa')) {
           console.log()
       }
    }) */
5

let token = await getGraphTokenReducedScope()
 var weakSPNAuth = results.filter(is => is.claims?.appidacr !== "2" && is.claims?.idtyp == "app")
 .map(it => it.caller)
 
 var weakUserAuth = results.filter(is => !is?.claims?.idtyp && is.caller !=='System' && is.claims)
 .filter( is =>  !is.claims["http://schemas.microsoft.com/claims/authnmethodsreferences"].match(new RegExp('mfa|rsa','g')))
 .map(user => `UPN:${user.caller} : ${user.claims["http://schemas.microsoft.com/claims/authnmethodsreferences"]}` )

 var weakAuthenticationEvents = []

 for await (caller  of new Set(weakSPNAuth)) {
    let oidName = await graph(token,`/directoryObjects/${caller}?$select=id,displayName`).catch(error  => console.log('no graph caller identified, object can be deleted, but the log still remains'))
    weakAuthenticationEvents.push(`SPN:${oidName?.displayName || caller} : pwd with claim appIdAcr=1`)
    
}

returnObject.isHealthy=true
 new Set(weakUserAuth).forEach(weakUsr => weakAuthenticationEvents.push(weakUsr))


 console.log(weakAuthenticationEvents)
 
if (weakAuthenticationEvents.length > 0) {
    returnObject.isHealthy=false
}
returnObject.metadata = {weakAuthenticationEvents, evaluated:results.length}
//console.log(stashOrig)

return returnObject

}





async function axiosLoop(nextLink,src) {
    console.log('returning actity logs')

    var token = await  getToken()
    
    const opt = {
        url:nextLink,
        headers: {
            Authorization: `Bearer  ${token}`,
            "content-type": "application/json",
          },
    }
    
    const {data} = await axios(opt)
    data.value.forEach(item => src.push(item))
    
    if (data.nextLink) {
    
        await axiosLoop(data.nextLink,src)
    
    } else {
        return src
    }
    return src
    
    }
