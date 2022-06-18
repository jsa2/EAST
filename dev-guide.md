# Developing and debugging controls in EAST ( Extensible Azure Security Tool )

- [Developing and debugging controls in EAST ( Extensible Azure Security Tool )](#developing-and-debugging-controls-in-east--extensible-azure-security-tool-)
  - [Mapping](#mapping)
    - [mapping logic](#mapping-logic)
    - [.apiVersion files](#apiversion-files)
    - [.skip files](#skip-files)
    - [Provider folder](#provider-folder)
  - [Controls and control functions](#controls-and-control-functions)
    - [Control description files](#control-description-files)
    - [Control Function files](#control-function-files)
    - [Flow order](#flow-order)
  - [To be continued...](#to-be-continued)


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
Each Azure Resource Manager (ARM) provider folder has in it's root folder (or subprovider root) a file that specifies the API version to be used with ARM. There is no default API version, so when you create new version you need to catch the inevitable error (if you did not guess, or lookup the api version somewhere beforehand)

**✅ Tip** - to debug failing control functions set breakpoint in VSCode to [``pluginRunner.js``](plugins/pluginRunner.js) (row 52)
```js 
catch (error) {
                return new erroResponseSchema(native,error)
        } 
``` 

![image](https://user-images.githubusercontent.com/58001986/172815865-208c7b21-d558-4999-9e01-6655224abbf4.png)

**Select correct resource provider from the**
``
"No registered resource provider found for location 'westeurope' and API version '2099-06-01' for type 'storageAccounts'. The supported api-versions are '2021-09-01, 2021-08-01, 2021-06-01, 2021-05-01, 2021-04-01, 2021-02-01, 2021-01-01, 2020-08-01-preview, 2019-06-01, 2019-04-01, 2018-11-01, 2018-07-01, 2018-03-01-preview, 2018-02-01, 2017-10-01, 2017-06-01, 2016-12-01, 2016-05-01, 2016-01-01, 2015-06-15, 2015-05-01-preview'. The supported locations are ...'."
``

### .skip files



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
0. Resources to be inspected are gathered as per defined in arguments [see parameters in readme.md](readme.md)
1. [``` Main.js ```  ](plugins/main.js)
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

## To be continued...


