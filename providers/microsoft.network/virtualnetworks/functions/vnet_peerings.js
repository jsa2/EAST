

const { AzNodeRest } = require("../../../../plugins/nodeSrc/east")
const { returnObjectInit } = require("../../../../plugins/nodeSrc/returnObjectInit")


//AzNodeRest
module.exports = async function (item) {

    let returnObject = new returnObjectInit(item, __filename.split('/').pop())


    if (item?.properties?.virtualNetworkPeerings == "") {
        returnObject.isHealthy = true
        returnObject.metadata = {result:"no peerings"}
    }
    else {
        returnObject.isHealthy = "review"
        returnObject.metadata = { peering:JSON.stringify(item?.properties?.virtualNetworkPeerings) }
    }
    
    //console.log(stashOrig)

    return returnObject

}





