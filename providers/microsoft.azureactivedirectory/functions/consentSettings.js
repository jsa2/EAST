const { default: axios } = require("axios")
const { getGraphToken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

 var data = await main()

 var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.name = item.name
returnObject.id = item.name

if (item?.properties) {
    returnObject.isHealthy=false
}
else {
    returnObject.isHealthy=true
}

returnObject.metadata = data

return returnObject

}


async function main () {

  var graphToken = await getGraphToken()

  var opt = {
    url: "https://graph.microsoft.com/v1.0/policies/authorizationPolicy",
    "headers": {
      "accept": "*/*",
      "accept-language": "en",
      authorization: `Bearer ${graphToken}`,
      "content-type": "application/json",
    },
  }

  var {data:authorizationPolicy} = await axios(opt).catch((error ) => {
    console.log(error)
  })
  var {defaultUserRolePermissions} = authorizationPolicy

  if (defaultUserRolePermissions) {
  

    //ManagePermissionGrantsForSelf.microsoft-user-default-legacy - this is the old block for consent
    //ManagePermissionGrantsForSelf.microsoft-user-default-low - This blocks non verified apps
    //allowedToCreateApps:false - this is the application registration settings
  
    authorizationPolicy.usersCanRegisterApps=`${defaultUserRolePermissions.allowedToCreateApps} - Alias for usersCanRegisterApps`
  
    if (defaultUserRolePermissions.permissionGrantPoliciesAssigned.length == 0) {
      authorizationPolicy.userCanConsent = `Blocked`
    }

    defaultUserRolePermissions.permissionGrantPoliciesAssigned.map((s) => {
      
      if (s == "ManagePermissionGrantsForSelf.microsoft-user-default-legacy") {
         authorizationPolicy.userCanConsent = `Default - allowed = Alias for ${s}`
      }
  
      if (s == "ManagePermissionGrantsForSelf.microsoft-user-default-low") {
        authorizationPolicy.userCanConsent = `Blocked for non verified publishers = Alias for ${s}`
      }
      
    })
  
  }

 
 return {
   authorizationPolicy
 }


}
