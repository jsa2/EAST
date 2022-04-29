# Extensible Azure Security Tool 

Extensible Azure Security Tool (Later referred as E.A.S.T) is tool for assessing Azure and to some extent Azure AD security controls. Primary use case of EAST is Security data collection for evaluation in Azure Assessments. This information (JSON content) can then be used in various reporting tools, which we use to further correlate and investigate the data.

This tool is currently being developed by yours truly @[Nixu](https://www.nixu.com/) LTD under [MIT license](https://github.com/jsa2/EAST/blob/public/LICENSE).


![img](https://user-images.githubusercontent.com/58001986/161537923-6af229e8-0267-42bb-8979-eddadabb3525.png)


![image](https://user-images.githubusercontent.com/58001986/161073205-66d1ae9e-d182-4089-aed2-3c04d3176bde.png)



---

**Table of contents**

- [Extensible Azure Security Tool](#extensible-azure-security-tool)
- [Important](#important)
- [Tool operation](#tool-operation)
  - [Depedencies](#depedencies)
  - [Controls](#controls)
    - [Basic](#basic)
    - [Advanced](#advanced)
    - [Composite](#composite)
  - [reporting](#reporting)
    - [Running EAST scan](#running-east-scan)
      - [Detailed Prerequisites](#detailed-prerequisites)
      - [Login Az CLI and run the scan](#login-az-cli-and-run-the-scan)
  - [Licensing](#licensing)
- [Tool operation documentation](#tool-operation-documentation)
  - [Principles](#principles)
    - [AZCLI USE](#azcli-use)
    - [Speedup](#speedup)
    - [Build session from Azure Cloud Shell (BASH)](#build-session-from-azure-cloud-shell-bash)
  - [Developing controls (snippets)](#developing-controls-snippets)
    - [Control files](#control-files)
    - [Workflow for native Functions](#workflow-for-native-functions)
  - [Updates and examples](#updates-and-examples)
    - [Auditing Microsoft.Web provider (Functions and web apps)](#auditing-microsoftweb-provider-functions-and-web-apps)
    - [Azure RBAC baseline authorization](#azure-rbac-baseline-authorization)
  - [End of document](#end-of-document)

---

# Important
⚠️ **Current status of the tool is beta** 
- Fixes, updates etc. are done on "Best effort" basis, with no guarantee of time, or quality of the possible fix applied
- We do some additional tuning before using EAST in our daily work, such as apply various run and environment restrictions, besides formalizing ourselves with the environment in question. Thus we currently recommend, that EAST is run in only in test environments, and with **read-only permissions**. 
  - All the calls in the service are largely to Azure Cloud IP's, so it should work well in hardened environments where outbound IP restrictions are applied. This reduces the risk of this tool containing malicious packages which could "phone home" without also having C2 in Azure. 
    - Essentially running it in read-only mode, reduces a lot of the risk associated with possibly compromised NPM packages ([Google compromised NPM](https://www.google.com/search?q=compromised+npm+packages&oq=compromised+npm+p&aqs=edge.0.0i512j69i57j0i20i263i512.2812j0j1&sourceid=chrome&ie=UTF-8))
    - **Bugs etc:** You can protect your environment against certain mistakes in this code by running the tool with reader-only permissions
- Lot of the code is "AS IS": Meaning, it's been serving only the purpose of creating certain result; Lot of cleaning up and modularizing remains to be finished
- There are no tests at the moment, apart from certain manual checks, that are run after changes to main.js and various more advanced controls.
- The control descriptions at this stage are not the final product, so giving feedback on them, while appreciated, is not the focus of the tooling at this stage
- As the name implies, we use it as tool to evaluate environments. It is not meant to be run as unmonitored for the time being, and should not be run in any internet exposed service that accepts incoming connections.
- Documentation could be described as incomplete for the time being
- EAST is mostly focused on PaaS resource, as most of our Azure assessments focus on this resource type


# Tool operation 
## Depedencies
To reduce amount of code we use the following depedencies for operation and aesthetics are used (Kudos to the maintainers of these fantastic packages)
  
 package | aesthetics|operation
  -|-|-
  [axios](https://www.npmjs.com/package/axios)||✅
  [yargs](https://www.npmjs.com/package/yargs)||✅
  [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | |✅
  [chalk](https://www.npmjs.com/package/chalk)| ✅
   [js-beautify ](https://www.npmjs.com/package/js-beautify) | ✅


**Other depedencies for running the tool:** 
If you are planning to run this in Azure Cloud Shell you don't need to install Azure CLI:

Azure Cloud Shell (BASH)
 or applicable Linux Distro / WSL
Requirement | description | Install
-|-|-
✅ AZ CLI |  [AZCLI USE](#azcli-use) |``curl -sL https://aka.ms/InstallAzureCLIDeb \| sudo bash``
✅ Node.js runtime 14 | Node.js runtime for EAST |[install with NVM](https://github.com/nvm-sh/nvm#install--update-script)



---

## Controls
EAST provides three categories of controls: Basic, Advanced, and Composite

The machine readable control looks like this, regardless of the type (Basic/advanced/composite):

```json
{
  "name": "fn-sql-2079",
  "resource": "/subscriptions/6193053b-408b-44d0-b20f-4e29b9b67394/resourcegroups/rg-fn-2079/providers/microsoft.web/sites/fn-sql-2079",
  "controlId": "managedIdentity",
  "isHealthy": true,
  "id": "/subscriptions/6193053b-408b-44d0-b20f-4e29b9b67394/resourcegroups/rg-fn-2079/providers/microsoft.web/sites/fn-sql-2079",
  "Description": "\r\n Ensure The Service calls downstream resources with managed identity",
  "metadata": {
    "principalId": {
      "type": "SystemAssigned",
      "tenantId": "033794f5-7c9d-4e98-923d-7b49114b7ac3",
      "principalId": "cb073f1e-03bc-440e-874d-5ed3ce6df7f8"
    },
    "roles": [{
      "role": [{
        "properties": {
          "roleDefinitionId": "/subscriptions/6193053b-408b-44d0-b20f-4e29b9b67394/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
          "principalId": "cb073f1e-03bc-440e-874d-5ed3ce6df7f8",
          "scope": "/subscriptions/6193053b-408b-44d0-b20f-4e29b9b67394/resourceGroups/RG-FN-2079",
          "createdOn": "2021-12-27T06:03:09.7052113Z",
          "updatedOn": "2021-12-27T06:03:09.7052113Z",
          "createdBy": "4257db31-3f22-4c0f-bd57-26cbbd4f5851",
          "updatedBy": "4257db31-3f22-4c0f-bd57-26cbbd4f5851"
        },
        "id": "/subscriptions/6193053b-408b-44d0-b20f-4e29b9b67394/resourceGroups/RG-FN-2079/providers/Microsoft.Authorization/roleAssignments/ada69f21-790e-4386-9f47-c9b8a8c15674",
        "type": "Microsoft.Authorization/roleAssignments",
        "name": "ada69f21-790e-4386-9f47-c9b8a8c15674",
        "RoleName": "Contributor"
      }]
    }]
  },
  "category": "Access"
},
```


### Basic

Basic controls include checks on the initial ARM object for simple "toggle on/off"- boolean settings of said service.

**Example: Azure Container Registry adminUser**

[acr_adminUser](providers/microsoft.containerregistry/functions/acr_adminUser.js)

Portal|EAST
-|-
  ![image](https://user-images.githubusercontent.com/58001986/161068619-3dd5ec85-9c4c-405e-9294-e0c207df6c68.png) | ``if (item.properties?.adminUserEnabled == false ){returnObject.isHealthy = true }``



### Advanced

Advanced controls include checks beyond the initial ARM object. Often invoking new requests to get further information about the resource in scope and it's relation to other services.


**Example: Role Assignments**

Besides checking the role assignments of subscription, additional check is performed via Azure AD Conditional Access Reporting for MFA, and that privileged accounts are not only protected by passwords (SPN's with client secrets)

**Example: Azure Data Factory**

[ADF_pipeLineRuns](providers/microsoft.datafactory/functions/ADF_pipeLineRuns.js)

Azure Data Factory pipeline mapping combines pipelines -> activities -> and data targets together and then checks for secrets leaked on the logs via run history of the said activities.

![img](https://user-images.githubusercontent.com/58001986/161069538-a4d79567-d607-4a5f-a5a4-554257add861.png)

---

### Composite

Composite controls combines two or more control results from pipeline, in order to form one, or more new controls. Using composites solves two use cases for EAST
1. You cant guarantee an order of control results being returned in the pipeline 
2. You need to return more than one control result from single check

**Example: [composite_resolve_alerts](composites/composite_resolve_alerts.js)**

1. Get alerts from Microsoft Cloud Defender on subscription check
2. Form new controls per resourceProvider for alerts

## reporting

EAST is not focsed to provide automated report generation, as it provides mostly JSON files with control and evaluation status. The idea is to use separate tooling to create reports, which are fairly trivial to automate via MD creation scripts and tools such as [Pandoc](https://github.com/jgm/pandoc#the-universal-markup-converter) 

- While focus is not on the reporting, this repo includes example automation for report creation with pandoc to ease reading of the results in single document format.


---


### Running EAST scan
This part has guide how to run this either on BASH@linux, or BASH on Azure Cloud Shell (obviously Cloud Shell is Linux too, but does not require that you have your own linux box to use this)

⚠️ If you are running the tool in Cloud Shell, you might need to reapply some of the installations again as Cloud Shell does not persist various session settings.





**Fire and forget prerequisites on cloud shell**

```bash
curl -o- https://raw.githubusercontent.com/jsa2/EAST/public/sh/initForuse.sh | bash;
# Force reload of NVM
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
# This loads nvm

``` 

[jump to next step](#login-az-cli-and-run-the-scan)

#### Detailed Prerequisites

**Prerequisites**
```bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

nvm install 14

nvm use 14

cd EAST;
npm install

``` 

**Pandoc installation on cloud shell**
```bash
# Get pandoc for reporting (first time only)
wget  "https://github.com/jgm/pandoc/releases/download/2.17.1.1/pandoc-2.17.1.1-linux-amd64.tar.gz"; 
tar xvzf "pandoc-2.17.1.1-linux-amd64.tar.gz" --strip-components 1 -C ~

```

**Installing pandoc on distros that support APT**
```bash
# Get pandoc for reporting (first time only)
sudo apt install pandoc
``` 

#### Login Az CLI and run the scan

```bash 

# Relogin is required to ensure token cache is placed on session on cloud shell

az account clear
az login

#
cd EAST
# replace the subid below with your subscription ID!
subId=6193053b-408b-44d0-b20f-4e29b9b67394
# 
nvm use 14
node ./plugins/main.js --batch=10 --nativescope=true --roleAssignments=true --helperTexts=true --checkAad=true --scanAuditLogs --composites --subInclude=$subId

```
  ![img](https://user-images.githubusercontent.com/58001986/161217309-eba715c3-df7b-4743-b336-54d7ce1a5786.gif)





**Generate report**

``cd EAST; node templatehelpers/eastReports.js --doc`` 

- If you want to include all Azure Security Benchmark results in the report

``cd EAST; node templatehelpers/eastReports.js --doc --asb`` 

**Export report from cloud shell**

`` pandoc -s fullReport2.md -f markdown -t docx --reference-doc=pandoc-template.docx -o fullReport2.docx `` 

![image](https://user-images.githubusercontent.com/58001986/161531433-4254e231-445f-4443-a7e4-22f4a81f1df3.png)

**Azure Devops (Experimental)**
There is Azure Devops control for dumping pipeline logs. You can specify the control run by following example:

``` node ./plugins/main.js --batch=10 --nativescope=true --roleAssignments=true --helperTexts=true --checkAad=true --scanAuditLogs --composites --subInclude=$subId --azdevops "organizationName" ```

--- 
## Licensing

**Community use**
- Share relevant controls across multiple environments as community effort

**Company use**
- Companies have possibility to develop company specific controls which apply to company specific work. Companies can then control these implementations by decision to share, or not share them based on the operating principle of that company. 

**Non IPR components**
- Code logic and functions are under MIT license. since code logic and functions are alredy based on open-source components & vendor API's, it does not make sense to restrict something that is already based on open source

If you use this tool as part of your commercial effort 

[Read license](https://github.com/jsa2/EAST/blob/public/LICENSE)

---

# Tool operation documentation

## Principles


### AZCLI USE
**Existing tooling enhanced with Node.js runtime**

Use rich and maintained context of [Microsoft Azure CLI](https://github.com/Azure/azure-cli#microsoft-azure-cli) ``login & commands``  with Node.js control flow which supplies enhanced rest-requests and maps results to schema.
 - This tool does not include or distribute Microsoft Azure CLI, but rather uses it when it has been installed on the source system (Such as Azure Cloud Shell, which is primary platform for running EAST)

### Speedup

View more [details](speedup.md)

✅ Using Node.js runtime as orchestrator utilises Nodes asynchronous nature allowing batching of requests. Batching of requests utilizes the full extent of Azure Resource Managers incredible speed. 

✅ Compared to running requests one-by-one, the speedup can be up to 10x, when Node executes the batch of requests instead of single request at time

### Build session from Azure Cloud Shell (BASH)

1. Session from GitHub actions and Azure cloud shell is used in our tooling seamlessly
   
   ✅ This reduces the need of install tooling on the desktop, especially as Azure Cloud Shell has GIT and NodeJS runtime preinstalled. (Altough never node version is required, than what cloud shell provides OOTB)
  
    ✅ ``Node``, ``Git`` and ``Code``  is available from Azure Cloud Shell without installing of depedencies 


**Node snippet (example, not full code)**

Node uses ``runner()`` , essentially an promisified ``exec()`` to get access tokens from AZ CLI and places it under session context 

```js
var token = await require('../pluginRunner').runner('az account get-access-token --resource=https://management.azure.com --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','sessionToken.json'),JSON.stringify(token))
        return token || error
```

## Developing controls (snippets)
I am planning to introduce full developer guide, but for the time being there are only these snippets available:

### Control files
Control files are JSON definitions that are supplemented to the automation running the control.

![image](https://user-images.githubusercontent.com/58001986/161532221-f9024b2e-bfa7-4c11-ba7c-3819fed8bd8a.png)

- Control files are authored as .MD files, and then converted to JSON with, so they are machine readable 

```
        |--providers
            ... 
            <individual control files>
```
  
**Conversion to machine readable**
```js 
   if (file.match('.md') ) {
       console.log(`converted file ${file}`)
       createJSONObj(file)       
```

**Control file**
```json
{
  "ControlId": "managedIdentity",
  "Category": "Authentication strength, Attack surface reduction",
  "Description": "Ensure that function calls downstream resources with managed identity"
}
```

### Workflow for native Functions
Control files are supplied with corresponding function. Below is basic example for the execution structure.

- [providers](../east/providers/)  'Microsoft.Sql'
  - [controls](../east/providers/Microsoft.Sql/controls/) 
  - [functions](../east/providers/Microsoft.Sql/functions/) 


```
|-- plugins
    |--main.js <This one executes the main program and processes the arguments>
        |--pluginRunner.js -> schemaBuilder.js 
        | <Individual functions that match controlFile Name> under providers folder:
          |--function (example below) that is matched under schemaBuilder
```

```javascript
module.exports = async function (item) {

var returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

// checks SQL Firewall settings

item = await AzNodeRest(`${item.id}/firewallRules/`,apiversion)

var is = item?.value.filter((rules) => rules.name == "AllowAllWindowsAzureIps")

if ( is.length > 0){
    returnObject.isHealthy=false
} 

returnObject.metadata = {item}
return returnObject  

```
        
## Updates and examples
### Auditing Microsoft.Web provider (Functions and web apps)

✅ Check roles that are assigned to function managed identity in Azure AD and all Azure Subscriptions the audit account has access to <br>
✅ Relation mapping, check which keyVaults the function uses across all subs the audit account has access to<br>
✅ Check if Azure AD authentication is enabled
✅ Check that generation of access tokens to the api requires assigment ``.appRoleAssignmentRequired`` <br>
✅ Audit bindings <br>
  - Function or Azure AD Authentication enabled
  - Count and type of triggers
<br>

✅ Check if [SCM](https://docs.microsoft.com/en-us/azure/azure-functions/security-concepts#secure-the-scm-endpoint) and [FTP](https://docs.microsoft.com/en-us/azure/azure-functions/security-concepts#disable-ftp) endpoints are secured 


![image](https://user-images.githubusercontent.com/58001986/149164241-55a478b1-50aa-4a19-b6d4-1f429f5d5711.png)


### Azure RBAC baseline authorization 

⚠️ Detect principals in privileged subscriptions roles protected only by password-based single factor authentication. 
-  Checks for users without MFA policies applied for set of conditions
-  Checks for ServicePrincipals protected only by password (as opposed to using Certificate Credential, workload federation and or workload identity CA policy)
  
  Maps to [App Registration Best Practices](https://docs.microsoft.com/en-us/azure/active-directory/develop/security-best-practices-for-app-registration#credential-configuration)
- *An unused credential on an application can result in security breach. While it's convenient to use  <span style="color:red">password</span>. secrets as a credential, we strongly recommend that you use x509 certificates as the only credential type for getting tokens for your application*

``✅State healthy`` - **User result example**  
```JSON
{ 
  "subscriptionName": "EAST -msdn",
  "friendlyName": "joosua@thx138.onmicrosoft.com",
    "mfaResults": {
      "oid": "138ac68f-d8a7-4000-8d41-c10ff26a9097",
      "appliedPol": [{
        "GrantConditions": "challengeWithMfa",
        "policy": "baseline",
        "oid": "138ac68f-d8a7-4000-8d41-c10ff26a9097"
      }],
      "checkType": "mfa"
    },
    "basicAuthResults": {
      "oid": "138ac68f-d8a7-4000-8d41-c10aa26a9097",
      "appliedPol": [{
        "GrantConditions": "challengeWithMfa",
        "policy": "baseline",
        "oid": "138ac68f-d8a7-4000-8d41-c10aa26a9097"
      }],
      "checkType": "basicAuth"
      },
    }
```
``⚠️State unHealthy`` - **Application principal example**  

```json
{ 
  "subscriptionName": "EAST - HoneyPot",
      "friendlyName": "thx138-kvref-6193053b-408b-44d0-b20f-4e29b9b67394",
      "creds": {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#servicePrincipals(id,displayName,appId,keyCredentials,passwordCredentials,servicePrincipalType)/$entity",
        "id": "babec804-037d-4caf-946e-7a2b6de3a45f",
        "displayName": "thx138-kvref-6193053b-408b-44d0-b20f-4e29b9b67394",
        "appId": "5af1760e-89ff-46e4-a968-0ac36a7b7b69",
        "servicePrincipalType": "Application",
        "keyCredentials": [],
        "passwordCredentials": [],
        "OnlySingleFactor": [{
          "customKeyIdentifier": null,
          "endDateTime": "2023-10-20T06:54:59.2014093Z",
          "keyId": "7df44f81-a52c-4fd6-b704-4b046771f85a",
          "startDateTime": "2021-10-20T06:54:59.2014093Z",
          "secretText": null,
          "hint": null,
          "displayName": null
        }],
        "StrongSingleFactor": []
        }
}

```
## End of document
Please follow the repo if you want to receive updates on progress.

