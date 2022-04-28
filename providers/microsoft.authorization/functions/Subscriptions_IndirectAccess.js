
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {
    
  item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
  
 
  let returnObject = new returnObjectInit(item,__filename.split('/').pop())
  returnObject.isHealthy=true

  try {

    var {value} = await AzNodeRest(`/subscriptions/${item.name}/providers/Microsoft.ManagedServices/registrationAssignments?$expandRegistrationDefinition=true`,"2020-02-01-preview")

  if (value.length > 0) {
    returnObject.isHealthy="review"
  }
  return returnObject
  


  } catch(error) {


    returnObject.isHealthy="not applicable"
    returnObject.metadata={error: JSON.stringify(error)}
    return returnObject
  
  }
  


}
