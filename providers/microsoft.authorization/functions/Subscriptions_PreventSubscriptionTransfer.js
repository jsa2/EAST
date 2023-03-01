
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {
    
  item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
  
 
  let returnObject = new returnObjectInit(item,__filename.split('/').pop())
  returnObject.isHealthy="false"

  try {

    let {properties} = await AzNodeRest(`/providers/Microsoft.Subscription/policies/default`,"2021-10-01")

  if (properties?.blockSubscriptionsLeavingTenant == true) {
    returnObject.isHealthy="true"
  }
  returnObject.metadata={blockSubscriptionsLeavingTenant:JSON.stringify(properties)}
  return returnObject
  


  } catch(error) {

        // Even with error return failure 

    returnObject.metadata={error: JSON.stringify(error)}
    return returnObject
  
  }
  


}
