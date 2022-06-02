# Developing and debugging controls for EAST

EAST follows Azure Resource Manager API, by mapping resourceId's to path's in EAST control structure

## Mapping 

EAST follows Azure Resource Manager API, by mapping resourceId's to path's in EAST control structure.

- Mapping follows the container (folders) structure based on resolved entities.
  



- In order for control to map, at least the [provider folder](#provider-folder) needs to exist


order | id | map | explanation
-|-|-|-
0| /subscriptions/{subId}/resourceGroups/rg-func-consumption/providers/**Microsoft.Insights/** | at the time of writing this guide, microsoft insigths is not supported provider |  [filterExistingProviders.js](plugins/nodeSrc/filterExistingProviders.js) does not issue get request since provider folder does not exist under [providers](/providers/)
1|/subscriptions/3{subId}/resourcegroups/rg-appsvc-webapps/providers/**microsoft.web**/sites/hybridspoof | mapped to **providers/microsoft.web/**
2|/subscriptions/{subId}/resourcegroups/rg-redirectlogs-11978 **/providers/microsoft.web/connections/** azuremonitorlogs | mapped to **providers/microsoft.web/connections/** 




### Provider folder
Provider folder always includes controls and functions 

- ✅ Controls include the JSON definition
- ✅ Function include the code that is run against the definition (to get the data that is described in the definition)

### controls and functions
