

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
 

let {properties} = item
let auth = []
if (properties?.definition?.actions) {
    enumAuthKey(properties?.definition?.actions,auth)
  

} 

if (auth.length == 0) {
    returnObject.isHealthy="notApplicable"
} else {
    returnObject.isHealthy="review"
}

returnObject.metadata={auth} 

return returnObject

}

function enumAuthKey (v,mp) {

if (typeof(v) === "object") {
   
    if (v.hasOwnProperty('authentication')) {
        let hasManagedIdentity = JSON.stringify(v).toLowerCase().match('managed')?.input
        mp.push({authOptions:v,hasManagedIdentity})
    }

    Object.keys(v).map(s => {
        enumAuthKey(v[s],mp)
    })

}
}


