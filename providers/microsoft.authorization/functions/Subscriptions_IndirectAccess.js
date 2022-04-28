
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {
    
  item.id = `/subscriptions/${item.name}/providers/microsoft.authorization`
  

  let returnObject = new returnObjectInit(item,__filename.split('/').pop())
  returnObject.isHealthy=true
  var {value} = await AzNodeRest(`/subscriptions/${item.name}/providers/Microsoft.ManagedServices/registrationAssignments?$expandRegistrationDefinition=true`,"2020-02-01-preview")
  
  returnObject.metadata = {authorizations:value}

  if (value.length > 0) {
    returnObject.isHealthy="review"
  }
  
  return returnObject
  

}
