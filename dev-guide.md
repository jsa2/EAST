# Developing and debugging controls in EAST ( Extensible Azure Security Tool )

- [Developing and debugging controls in EAST ( Extensible Azure Security Tool )](#developing-and-debugging-controls-in-east--extensible-azure-security-tool-)
  - [Mapping](#mapping)
    - [mapping logic](#mapping-logic)
    - [.apiVersion files](#apiversion-files)
      - [Debugging API version](#debugging-api-version)
    - [.skip files](#skip-files)
    - [Provider folder](#provider-folder)
  - [Controls and control functions](#controls-and-control-functions)
    - [Control description files](#control-description-files)
    - [Control Function files](#control-function-files)
    - [Flow order](#flow-order)
  - [Running in VScode](#running-in-vscode)
  - [Error handling flow](#error-handling-flow)
    - [Finding errors in content.json](#finding-errors-in-contentjson)
  - [Tips](#tips)
- [To be continued.](#to-be-continued)


## Mapping 


EAST follows Azure Resource Manager API, by mapping resourceId's to path's in EAST control structure. This structure (folder mapping) will provide functions and control files to be run in the pipeline.



- Mapping follows the [``providers``](providers/) container (folder) structure based on resolved entities.

![image](https://user-images.githubusercontent.com/58001986/172820989-1c274c88-e670-414f-b2e6-bb31b18220e4.png)

- In order for control to map, at least the [provider folder](#provider-folder) needs to exist. After matching to provider folder, following [logic](#mapping-logic) is applied 


### mapping logic

order | id | map | explanation
-|-|-|-
0 (skipped)| /subscriptions/{subId}/resourceGroups/rg-sd/providers/**Microsoft.Insights/** | skipped see explanation |  [filterExistingProviders.js](plugins/nodeSrc/filterExistingProviders.js) does not issue get request since provider folder does not exist under [providers](/providers/)
1 (skipped) | /subscriptions/{subId}/resourceGroups/rg-sd/providers/Microsoft.Network/privateDnsZones/priv.dewi.red | skipped see explanation | the resource is explicitly configured to be skipped due to not having any checks created yet, nonetheless there are other categories in microsoft.network provider and we don't want to have them skipped in resolving order 0 so we use [.skip file](providers/microsoft.network/.skip.json)
1|/subscriptions/{subId}/resourcegroups/rg-sd/providers/**microsoft.web**/sites/hybridspoof | mapped to root provider providers/**microsoft.web/**| issued get check as per [flow-order](#flow-order) 
2|/subscriptions/{subId}/resourcegroups/rg-sd **/providers/microsoft.web/connections/** azuremonitorlogs | mapped to sub-provider providers/ **microsoft.web/connections/** | if the provider folder has sub-providers, the resolving mechanism will try to match into them first, if no sub-providers exist, the resolving would then default to the root of the provider - followed then by issued get check as per [flow-order](#flow-order) 


###  .apiVersion files
Each Azure Resource Manager (ARM) provider folder has in it's root folder (or subprovider root) a file that specifies the API version to be used with ARM. 

📝 - There is no default API version, so when you create new version you need to catch the inevitable error (if you did not guess, or lookup the api version somewhere beforehand)


![image](https://user-images.githubusercontent.com/58001986/174536706-47eb02cd-9c83-4ddc-802e-50924f018430.png)

#### Debugging API version
**✅ Tip** - to debug failing control functions set breakpoint in VSCode to [``pluginRunner.js``](plugins/pluginRunner.js) (row 52)
```js 
catch (error) {
                return new erroResponseSchema(native,error)
        } 
``` 

![image](https://user-images.githubusercontent.com/58001986/172815865-208c7b21-d558-4999-9e01-6655224abbf4.png)

**Select correct resource provider based on error response**
``
"No registered resource provider found for location 'westeurope' and API version '2099-06-01' for type 'storageAccounts'. The supported api-versions are '2021-09-01, ...'. The supported locations are ...'."
``

### .skip files

``.skip`` files as described in [flow order](#flow-order) can be used to prevent redundant requests to providers not supporting ¹any checks

![image](https://user-images.githubusercontent.com/58001986/174537134-bb47bf4e-da60-4c07-a88c-290dbff5d5b9.png)



¹ Not supporting = no controls have been created for the particular provider or sub-provider


### Provider folder
Provider folder always includes controls and control functions 

- ✅ Controls include the JSON definition
- ✅ Function include the code that is run against the definition (to get the data that is described in the definition)

## Controls and control functions

using [initControl.sh](sh/initControl.sh) will create new control pair. The most simple control type is manual

```sh 
name="aks_kubenetARPSpoof"
provider="microsoft.containerservice"
node manualControl.js --name $name --provider $provider
```

### Control description files

Control file is in it's most simple form a categorized description note. Controls can also be more comprehensive MD files, that are "flattened to JSON strings"

**Simple Control file**
```json
{
  "ControlId": "managedIdentity",
  "Category": "Access",
  "Description": "Ensure that function calls downstream resources with managed identity"
}
```

**Complex control file**

```json
{
"ControlId": "aad_combined",
"Category": "Access",
  "Description": "\n\n**Azure AD and Azure RBAC baseline**\n\nThis section includes baseline Azure AD security options related to Azure AD use with Azure RBAC.\n\n**Control descriptions**\n\n\n- Ensure MFA or (strong single factor) is required for Azure Management - preferably with all 'apps policy' CA Policy, and by certificate credentials authentication for service principals \n  - 🔍 [EAST_Subscriptions_roleAssignmentsRGAdvanced](#east_subscriptions_roleassignmentsrgadvanced)\n  - 🔍 [EAST_aad_caEval](#east_aad_caeval) \n- Ensure Azure AD principals in privileged roles are not protected by a password (client secret) \n  - 🔍 [EAST_Subscriptions_roleAssignmentsRGAdvanced](#east_subscriptions_roleassignmentsrgadvanced)\n  - 🔍 [EAST_aad_caEval](#east_aad_caeval) \n- Ensure Legacy Auth can't be bypassed on users in privileged roles\n  - 🔍 [EAST_Subscriptions_roleAssignmentsRGAdvanced](#east_subscriptions_roleassignmentsrgadvanced)\n  - 🔍 [EAST_aad_caEval](#east_aad_caeval) \n- Ensure users can't register Azure AD Applications \n  - 🔍 [EAST_consentSettings](#east_consentsettings)\n- Ensure day to day accounts are separated from privileged accounts\n- Ensure Azure AD logs are exported for analytics / SIEM   \n  - 🔍 [EAST_aad_diagnostics](#east_aad_diagnostics)\n- Review list of SPN's with directoryPermissions \n  - 🔍 [EAST_AAD_Privileged_SPN](#east_aad_privileged_spn)\n- Limit length of admin sessions in PIM and Conditional Access, so refresh tokens are not long lived beyond 24 hours\n- Prefer onmicrosoft.com accounts privileged roles (less dependencies to synced accounts, and can't be compromised by dns takeover of the customer domain) \n  - [source](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/protect-m365-from-on-premises-attacks#isolate-privileged-identities)\n- Ensure owner principals of privileged objects don't create implicit access (privilege elevation)\n  - By owning more privileged service principal, that they are own permissions are based on. This behavior is accepted, when it is known and documented (Access from pipeline to Service connection in Azure Devops) \n  - 🔍[EAST_composite_priveEsc](#east_composite_priveesc)\n"
}
```

### Control Function files

Function files are .JS modules, which at their simplest form they are as follows.
Each file needs to match certain response schema. That's why even manual control use [returnObjectInit.js](plugins/nodeSrc/returnObjectInit.js) to create new response, which is then checked in at later stage of the pipeline response with [responseSchema](plugins/nodeSrc/functionResponseSchema.js)
```js 
new responseSchema(functionResult, controlDefinition)
```

```js

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {
var returnObject = new returnObjectInit(item,__filename.split('/').pop())
returnObject.isHealthy=true
if (item?.properties?.networkProfile?.networkPlugin.match('kubenet')) {
    returnObject.isHealthy=false
}

returnObject.metadata=item.properties.networkProfile
return returnObject

}

```


### Flow order
1. Resources to be inspected are gathered as per defined in arguments 
  [parameters-reference](/readme.md#parameters-reference)
2. [``` Main.js ```  ](plugins/main.js)
batch is created at `` batchThrottled`` 

batch object compromises of:
- ARM resourceID string
- [`` schema `` ](plugins/nodeSrc/schemaBuilder.js) constructor 
- [`` runner `` ](plugins/pluginRunner.js) function

![image](https://user-images.githubusercontent.com/58001986/172818523-833ce8b0-1ca1-43a9-9b2e-36d1373d8e39.png)

2. [`` batch.js ``](plugins/nodeSrc/batch.js) processes the batch and schema
3. [``pluginRunner.js`` ](plugins/pluginRunner.js) issues  basic ``get`` request for the resourceID  [``east.js``](plugins/nodeSrc/east.js) 
   
4. then [``pluginRunner.js`` ](plugins/pluginRunner.js)  calls the [`` schemaBuilder.js`` ](plugins/nodeSrc/schemaBuilder.js) constructor to excecute all .js files for the resourceId mapped to provider

5. [``pluginRunner.js`` ](plugins/pluginRunner.js) returns the result to [`` batch.js ``](plugins/nodeSrc/batch.js) which returns the whole batch to [``` Main.js ```  ](plugins/main.js)
6. content.json is created including all control results (this file and many other are ignored from ``.git`` as per defined in [``.gitignore``](.gitignore)  )

## Running in VScode
1. Rename [``_launch.js``](.vscode/_launch.json) to ``launch.js``
2. Define arguments under args 
- Description for arguments is available here [parameters-reference](/readme.md#parameters-reference)
```json
[
"--batch=10",   
//"--tag=svc=aksdev",
"--nativescope=true",
 "--roleAssignments",
 "--checkAad",
// "--helperTexts",
// "--subInclude=3539c2a2-cd25-48c6-b295-14e59334ef1c",
//"--namespace=sites/dns",
//"--notIncludes=44ee6398gb8abb6d0",
//"--policy",
//"--nx",
//"--asb",
"--scanAuditLogs",
"--composites",
//"--clearTokens",
//"--azdevops=thx138",
// "--ignorePreCheck",
/*  "--reprocess", */
//"--SkipStorageThrottling",
//"--includeRG"
            ]
```

## Error handling flow

Excluding ``main.js`` error handling flow is as follows:

order | explanation
-|-
0| **First error stage** - debug failing control functions set breakpoint in VSCode to [``pluginRunner.js``](plugins/pluginRunner.js) (row 52) <br> ⚠️ This somewhat uncontrolled failure, as it will stop the rest of the batch for the particular resourceId. You should move these occurences to be handled in the particular function
1 | **Second error stage** - this is controlled handling of the error, as it will continue with the requests for the particular resourceId. <br> See example here for handling error like this [``VM_ManagedIdentity.js``](providers/microsoft.compute/functions/VM_ManagedIdentity.js)

### Finding errors in content.json

Look for string 'provider not supported' with the following error pattern:

```json
{
  "name": "vm-approx",
  "id": "/subscriptions/3539c2a2-cd25-48c6-b295-14e59334ef1c/resourcegroups/rg-appproxy/providers/microsoft.compute/virtualmachines/vm-approx",
  "fileName": "not applicable, provider not supported",
  "isHealthy": "not applicable, provider not supported",
  "error": "{\"error\":\"Not Found\",\"request\":\"/Microsoft.ManagedIdentity/userAssignedIdentities/azurekeyvaultsecretsprovider-aksf-eu3234\",\"url\":\"https://management.azure.com/subscriptions/3539c2a2-cd25-48c6-b295-14e59334ef1c/resourceGroups/MC_RG-aks-aksf-eu3234_aksf-eu3234_swedencentral/providers/Microsoft.ManagedIdentity/userAssignedIdentities/azurekeyvaultsecretsprovider-aksf-eu3234?api-version=2018-11-30\",\"errorBody\":{\"error\":{\"code\":\"ResourceGroupNotFound\",\"message\":\"Resource group 'MC_RG-aks-aksf-eu3234_aksf-eu3234_swedencentral' could not be found.\"}}}"
}
```


## Tips 
1. examples for helper to init new controls

lookup examples in [``initControl.sh``](sh/initControl.sh)

the run following to create new control for ``Azure Key Vault``
- after this run main.js. If you dont know the correct API version, you can look it up based on [debugging api version](#debugging-api-version)

```sh
name="KeyVault_Firewall"
provider="Microsoft.KeyVault"
node controlTemplate.js --name $name --provider $provider
```

# To be continued.





