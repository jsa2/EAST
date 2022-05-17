
## Highly experimental - Bypassing trusted Device requirements for Azure CLI in highly restricted environments where API's are available for browser sessions

Some environments require trusted device  to access API's on mobile and desktop clients (which AZ CLI is categorized as) - In such situations you can try to work around restrictions, if browser clients can access Azure management via browser session.


## Operation principle of the tool

Used for Azure Security scanning by https://github.com/jsa2/EAST#extensible-azure-security-tool 

Uses API `` https://portal.azure.com/api/DelegationToken `` to replace the tokens in ``msal_token_cache.json`` Azure CLI for Azure security scans in restricted environments.

CA Policy|Requires trusted device | MFA
-|-|-
mobile apps and desktop clients| ✅ | -
Browser| - |✅


**Disclaimer**
--- 

⚠️ This tool is only meant for Security research and pre agreed scanning of Azure environments where heavy restrictions prohibit Azure CLI use in mobile apps and desktop clients. 
- This tool does not work, if there is no browser use available without trusted device.

⚠️ This is not a hack, it bypassess Conditional Access Device requirements only when API's has intentional, or non-intentional gaps which allow accessing Azure management Portal via MFA.

--- 

**User not being able to Azure-CLI sign-in due to compliant device needed**

![image](https://user-images.githubusercontent.com/58001986/168766199-24d8b52b-8b58-4143-afae-b2c40db7f14f.png)


## Example policies


### Policy that requires Compliant Device for mobile apps and desktop clients

![image](https://user-images.githubusercontent.com/58001986/168766026-b73e0592-e7b0-4788-8dee-9da5f06a3a59.png)


## Setup

 Prerequisites

- Azure Cloud Shell Bash (or WSL/Linux bash) 
- Azure CLI installed
- MSAL cache needs to be located at 

1. Run `` az account clear`` to ensure no previous sessions exist 
2. Do not run `` Az Login `` unless you need to confirm, that Conditional Access is blocking your particular use case

## Start


```sh

touch sh/portalAuth.json
touch sh/delegationgGuids.json

```

1. Filter for "DelegationToken" in developer mode in URL's
2. Copy object for "Request Payload"

![image](https://user-images.githubusercontent.com/58001986/168545894-46a9d386-6cb2-48a4-a47b-8a96dee63635.png)

3. Paste object into this workspace as "sh/portalAuth.json"


![image](https://user-images.githubusercontent.com/58001986/168546182-de3255c5-5910-4f4f-92fa-e92fb001d0b4.png)

4. Paste session guids into this workspace as "sh/delegationgGuids.json" 
``
"browserId=234f7f49-d517-4590-b295-cd08618d966c; portalId=234f7f49-d517-4590-b295-cd08618d966c"
``

![image](https://user-images.githubusercontent.com/58001986/168551426-c31c93c3-b417-4d0a-a799-2af18c877f78.png)
![image](https://user-images.githubusercontent.com/58001986/168772764-8da060c0-99d7-4df3-abcd-1c74b9017da2.png)

1. Run ``node sh/getDelegationTokens.js``  [getDelegationTokens](sh/getDelegationTokens.js)
   
2. In Azure CLI run ``az resource list `` to verify that the access works
   
![image](https://user-images.githubusercontent.com/58001986/168773162-c91de18a-6441-4b1b-b5bc-7dce884d71e6.png)

