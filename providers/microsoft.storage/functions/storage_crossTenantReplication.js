


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())


/*

// add this part if you plan to add policies to report

let {apiversion} = getProviderApiVersion(item.id) */

/* let objectReplicationPolicies = await AzNodeRest(`${item.id}/objectReplicationPolicies/`,apiversion) */


if ( item?.allowCrossTenantReplication !== false){
    returnObject.isHealthy=false
} 

returnObject.metadata = {allowCrossTenantReplication:item?.allowCrossTenantReplication || true}
//console.log(stashOrig)

return returnObject

}


