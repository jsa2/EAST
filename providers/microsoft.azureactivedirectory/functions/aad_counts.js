

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { batchThrottledSimple } = require("../../../plugins/nodeSrc/batch")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { genericGraph } = require("../../../plugins/nodeSrc/graph")
const { getAADCAPol } = require("../../../plugins/nodeSrc/aadHelpers")



//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
returnObject.metadata={} 
returnObject.isHealthy="manual"

let counts = await mains()

returnObject.metadata={counts}

return returnObject

}

async function mains () {

    let graphToken = await getGraphToken()

let ar = [ {'item':"devices"},{'item':"groups"},{'item':"applications"},{'item':"users"}]

for await  (let cat of ar) {
    
    let opt = {
        responseType: 'json',
        "method": "get",
        url: `https://graph.microsoft.com/v1.0/${cat.item}/$count`,
        headers: {
            ConsistencyLevel: "Eventual",
            'content-type': "application/json",
            authorization: "Bearer " + graphToken
        }
      }
      
  
     cat.value = await genericGraph(opt).catch(error => console.log(error)) || "no value"
   
}

return ar

}
