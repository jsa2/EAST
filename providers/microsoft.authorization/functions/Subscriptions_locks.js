
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {
    
  item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
  
 
  let returnObject = new returnObjectInit(item,__filename.split('/').pop())
  returnObject.isHealthy="manual"

  try {

    var {value} = await AzNodeRest(`/subscriptions/${item.name}/providers/Microsoft.Authorization/locks`,"2016-09-01")

  if (value.length > 0) {
    returnObject.isHealthy="review"
  }
  returnObject.metadata={locks:JSON.stringify(value)}
  return returnObject
  


  } catch(error) {


    returnObject.isHealthy="not applicable"
    returnObject.metadata={error: JSON.stringify(error)}
    return returnObject
  
  }
  


}
