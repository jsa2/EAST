const { default: axios } = require("axios");
const fs = require('fs');
const { decode } = require("jsonwebtoken");

const msalCache = {
    AccessToken:{},
    Account:{},
    AppMetadata:{
        "appmetadata-login.microsoftonline.com-04b07795-8ddb-461a-bbee-02f9e1bf7b46": {
            "client_id": "04b07795-8ddb-461a-bbee-02f9e1bf7b46",
            "environment": "login.microsoftonline.com",
            "family_id": "1"
        }
    }
}

//Experimental, cachePop

main()
async function main() {
    var subscriptions

    const cached_at = Math.floor(Date.now() / 1000) + (60 * 60)

    try {
        console.log('ensuring current cache exists')
        console.log('trying to remove any previous cache')
      fs.readdirSync(`../../.azure/`).map(f => console.log(f))

    } catch (error) {
        console.log('unable to find MSAL cache at ~/.azure/')
        return; 
    }

    try {
        console.log('trying to remove any previous cache')
      fs.unlinkSync(`../../.azure/msal_token_cache.json`)
      fs.unlinkSync(`../../.azure/azureProfile.json`)
    } catch (error) {
        
    }

    let tkn 
    let arr = [
        {
            name:"loganalyticsapi",
            cacheName:"sessionToken.json",
            extensionName:"Microsoft_Azure_MonitoringA",
            "target": "https://management.core.windows.net//user_impersonation https://management.core.windows.net//.default",
        },
        {
            name:"microsoft.graph",
            extensionName:"microsoft_AAD_IAM",
            cacheName:"graphToken.json",
            "target": "email openid profile https://graph.microsoft.com/AuditLog.Read.All https://graph.microsoft.com/Directory.AccessAsUser.All https://graph.microsoft.com/Group.ReadWrite.All https://graph.microsoft.com/User.ReadWrite.All",
        },
        {
            name:"microsoft.graph",
            extensionName:"microsoft_AAD_IAM",
            cacheName:"graphToken2.json",
            "target": "email openid profile https://graph.microsoft.com/AuditLog.Read.All https://graph.microsoft.com/Directory.AccessAsUser.All https://graph.microsoft.com/Group.ReadWrite.All https://graph.microsoft.com/User.ReadWrite.All",
        },
        {
            name:"self",
            cacheName:"iamToken.json",
            extensionName:"microsoft_AAD_IAM",
            "target":"74658136-14ec-4630-ad9b-26e160ff0fc6/user_impersonation 74658136-14ec-4630-ad9b-26e160ff0fc6/.default",
        },
        {
            name:"graph",
            cacheName:"aadToken.json",
            extensionName:"microsoft_AAD_IAM",
            "target": "https://graph.windows.net//62e90394-69f5-4237-9190-012177145e10 https://graph.windows.net//.default",
        },
    ]
    
let c = 0
    for await (res of arr) {


        let data = require('./portalAuth.json')
        let cookie = require('./delegationgGuids.json')
        
        data.extensionName = res?.extensionName || "Microsoft_Azure_AD"
        data.resourceName = res.name
        console.log(res)
    let {data:val} =await axios("https://portal.azure.com/api/DelegationToken?feature.cacheextensionapp=false&feature.internalgraphapiversion=true&feature.tokencaching=true", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en",
    "content-type": "application/json",
    cookie,
  },data,

  "method": "POST"
}).catch(error => console.log(error?.response))

try {
     secret = val.value.authHeader.split('Bearer ')[1]
    fs.writeFileSync(`./plugins/session/${res.cacheName}`,`"${secret}"`)
    var  {payload:implant} = decode(secret, {complete:true})
   
    if (c == 0) {

        let userKey = `${implant.oid}.${implant.tid}-login.microsoftonline.com-organizations`
        msalCache.Account[userKey] = {
            "home_account_id": `${implant.oid}.${implant.tid}`,
            "environment": "login.microsoftonline.com",
            "realm": "organizations",
            "local_account_id": implant.oid,
            "username": implant.upn,
            "authority_type": "MSSTS"
        }

        let {data:subList} = await axios(`https://management.azure.com/subscriptions?api-version=2020-01-01`, {headers:{authorization: `Bearer ${secret}`}})

        subList.value.map((sub,index) => {
            if (index == 0) {
                sub.isDefault = true
            } else {
                sub.isDefault = false
            }
            sub.name = sub.displayName
            sub.user = {
                "name": implant.upn,
                "type": "user"
            },
            sub.id = sub.subscriptionId
            delete sub.subscriptionId
           

            console.log(sub)
            sub.homeTenantId = sub.tenantId
            sub.environmentName = "AzureCloud"
            delete sub.subscriptionPolicies
            delete sub.authorizationSource
            delete sub.displayName
            
        })
        subscriptions = subList.value

    }
    c++
  
    let atKey = `${implant.oid}.${implant.tid}-login.microsoftonline.com-accesstoken-04b07795-8ddb-461a-bbee-02f9e1bf7b46-${implant.tid}-${res.target}`
    msalCache.AccessToken[atKey] = {
            credential_type: "AccessToken",
            secret,
            home_account_id:`${implant.oid}.${implant.tid}`,
            environment: "login.microsoftonline.com",
            client_id: "04b07795-8ddb-461a-bbee-02f9e1bf7b46",
            target: res.target,
            realm: implant.tid,
            token_type: "Bearer",
            cached_at,
            expires_on: implant.exp,
            extended_expires_on: implant.exp
            }


} catch(error) {
    console.log(error)
}

    }

   
    console.log(msalCache)
    let dec = decode(tkn, {complete:true})
    fs.writeFileSync(`./plugins/session/msalCache.json`,JSON.stringify(msalCache))
    fs.writeFileSync(  '../../.azure/msal_token_cache.json' ,JSON.stringify(msalCache))


    let azureProfile = {
        "installationId": "4b7d5618-9ba8-11ec-9136-00155db2d57e",
        subscriptions,
    }
    
    //fs.writeFileSync(  'azureProfile2.json' ,JSON.stringify(azureProfile))
    fs.writeFileSync(  '../../.azure/azureProfile.json' ,JSON.stringify(azureProfile))
  

}