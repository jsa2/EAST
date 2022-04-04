


const { default: axios } = require("axios")
const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")
const { runner } = require("../../../plugins/pluginRunner")

//AzNodeRest
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

var token = await runner('az account get-access-token --resource=https://database.windows.net/ --query accessToken --output json')


var options = {
    method:"post",
    url:`https://sqliii.database.windows.net/databases/vulnerable/query?api-version=2018-08-01-preview&application=Azure%20SQL%20Query%20Editor`,
    data: `SELECT pr.principal_id, pr.name, pr.type_desc,   
    pr.authentication_type_desc, pe.state_desc, pe.permission_name  
    FROM sys.database_principals AS pr  
    JOIN sys.database_permissions AS pe  
    ON pe.grantee_principal_id = pr.principal_id;`,
    headers:{
        authorization:`Bearer ${token}`,
        "x-csrf-signature":"OfGCfnAXIsrY2Q/YtpGErxFU6oYh+743MpC073xMs0s=; not-before=2022-02-22T03:45:15Z; not-after=2022-02-22T04:05:15Z; signed-headers=authorization,host"
        }
    }

    console.log(options.data.query)

//let results = await AzNodeRest(undefined,undefined,undefined,options)


/* var d = await axios("https://sqliii.database.windows.net/databases/vulnerable/query?api-version=2018-08-01-preview&application=Azure%20SQL%20Query%20Editor", {
    "headers": {
  
      
      "content-type": "text/plain",
      "x-csrf-signature": "dog"
    },
    "referrer": "",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "SELECT pr.principal_id, pr.name, pr.type_desc,   \r\n    pr.authentication_type_desc, pe.state_desc, pe.permission_name  \r\nFROM sys.database_principals AS pr  \r\nJOIN sys.database_permissions AS pe  \r\n    ON pe.grantee_principal_id = pr.principal_id;",
    "method": "POST"
  }).catch((error ) => console.log(error))


   */
returnObject.metadata = {item}
//console.log(stashOrig)

return returnObject

}


