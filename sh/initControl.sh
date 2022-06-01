name="KeyVault_Firewall"
provider="Microsoft.KeyVault"
node controlTemplate.js --name $name --provider $provider

name="sf_ClusterProtectionLevel"
provider="microsoft.servicefabric"
node controlTemplate.js --name $name --provider $provider


#Diagversion

name="APIM_diagnosticSettings"
provider="microsoft.apimanagement"
node diagnosticSettings.js --name $name --provider $provider




name="sub_classicAdministrators"
provider="microsoft.authorization"
node controlTemplate.js --name $name --provider $provider

name="sub_alerts"
provider="microsoft.authorization"
node controlTemplate.js --name $name --provider $provider


name="general_auditLogs"
provider="microsoft.general"
node controlTemplate.js --name $name --provider $provider

name="aks_kubenetARPSpoof"
provider="microsoft.containerservice"
node manualControl.js --name $name --provider $provider


name="scanAuditLogs"
provider="microsoft.authorization"
node diagnosticSettings.js --name $name --provider $provider

name="general_aadauthnz"
provider="microsoft.general"
node manualControl.js --name $name --provider $provider


name="sql_minTLS"
provider="microsoft.sql"
node controlTemplate.js --name $name --provider $provider

name="Keyvault_ReviewAdvancedAccessPolicies"
provider="microsoft.keyvault"
node manualControl.js --name $name --provider $provider

name="sb_avoidNamespacePolicies"
provider="microsoft.servicebus"
node manualControl.js --name $name --provider $provider

name="acr_DiagnosticSettings"
provider="microsoft.containerregistry"
node diagnosticSettings.js --name $name --provider $provider

name="afd_waf"
provider="microsoft.sql"
node controlTemplate.js --name $name --provider $provider


"microsoft.dbformysql"

name="mysql_firewall"
provider="microsoft.dbformysql"
node controlTemplate.js --name $name --provider $provider


name="mysql_sslEnforceMent"
provider="microsoft.dbformysql"
node manualControl.js --name $name --provider $provider


name="psql_sslEnforcement"
provider="microsoft.dbforpostgresql"
node manualControl.js --name $name --provider $provider


## Init SubProvider
name="afd_waf2"
provider="microsoft.network/frontdoors"
node controlTemplateSubProvider.js --name $name --provider $provider

name="afd_waf_mode"
provider="microsoft.network/frontdoors"
node controlTemplateSubProvider.js --name $name --provider $provider

name="agw_waf"
provider="microsoft.network/applicationgateways"
node controlTemplateSubProvider.js --name $name --provider $provider


name="aks_apiServer"
provider="microsoft.containerservice"
node manualControl.js --name $name --provider $provider

name="LogicApps_Connections"
provider="microsoft.logic"
node manualControl.js --name $name --provider $provider

name="VM_ManagedIdentity"
provider="microsoft.compute"
node manualControl.js --name $name --provider $provider

name="aad_caEval"
provider="microsoft.azureactivedirectory"
node manualControl.js --name $name --provider $provider


## Init SubProvider
name="LogicApps_Connections"
provider="microsoft.web/connections"
node controlTemplateSubProvider.js --name $name --provider $provider


name="LogicApps_runHistory"
provider="microsoft.logic"
node manualControl.js --name $name --provider $provider

name="aks_networkPolicy"
provider="microsoft.containerservice"
node manualControl.js --name $name --provider $provider

name="LogicApps_diagnosticSettings"
provider="microsoft.logic"
node diagnosticSettings.js --name $name --provider $provider

name="eh_diagnosticSettings"
provider="microsoft.eventhub"
node diagnosticSettings.js --name $name --provider $provider

name="aad_ca_azureDevops"
provider="microsoft.azureactivedirectory"
node manualControl.js --name $name --provider $provider


name="storage_cloudShell"
provider="microsoft.storage"
node manualControl.js --name $name --provider $provider


name="cdn_securityHeaders"
provider="microsoft.cdn"
node diagnosticSettings.js --name $name --provider $provider