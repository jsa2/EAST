# Developing and debugging controls for EAST

EAST follows Azure Resource Manager API, by mapping resourceId's to path's in EAST control structure

## Mapping 

EAST follows Azure Resource Manager API, by mapping resourceId's to path's in EAST control structure.

- Mapping follows the container (folders) structure based on resolved entities.
  

- 

- In order for control to map, at least the [provider folder](#provider-folder) needs to exist


order | id | map | explanation
-|-|-|-
0 (skipped)| /subscriptions/{subId}/resourceGroups/rg-sd/providers/**Microsoft.Insights/** | skipped see explanation |  [filterExistingProviders.js](plugins/nodeSrc/filterExistingProviders.js) does not issue get request since provider folder does not exist under [providers](/providers/)
1 (skipped) | /subscriptions/{subId}/resourceGroups/rg-sd/providers/Microsoft.Network/privateDnsZones/priv.dewi.red | skipped see explanation | the resource is explicitly configured to be skipped due to not having any checks created yet, nonetheless there are other categories in microsoft.network provider and we don't want to have them skipped in resolving order 0
1|/subscriptions/{subId}/resourcegroups/rg-sd/providers/**microsoft.web**/sites/hybridspoof | mapped to root provider providers/**microsoft.web/**| [filterExistingProviders.js](plugins/nodeSrc/filterExistingProviders.js) does not issues get request since provider folder doe exist under [providers](/providers/)
2|/subscriptions/{subId}/resourcegroups/rg-sd **/providers/microsoft.web/connections/** azuremonitorlogs | mapped to sub-provider providers/ **microsoft.web/connections/** | if the provider folder has sub-providers, the resolving mechanism will try to match into them first, if no sub-providers exist, the resolving would then default to the root of the provider


### .skip files



### Provider folder
Provider folder always includes controls and functions 

- ✅ Controls include the JSON definition
- ✅ Function include the code that is run against the definition (to get the data that is described in the definition)

### controls and functions


