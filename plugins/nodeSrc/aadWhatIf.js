

function policyTemplate (policyId, oid) {
//console.log(policyId)
var allMfa = new createMFAtemplate(oid)
var allLegacy = new createLegacyTemplate(oid)
let allDevops = new createDevopsTempalte(oid)

    var policy = [
        allMfa,
        allLegacy,
        allDevops
    ]



   return policy[policyId]

}


function createLegacyTemplate (oid) {

  this.template = {
    conditions: {
      users: {
        allUsers: 2,
        excluded: {
          userIds: [
          ],
          groupIds: [
          ],
        },
        included: {
          userIds: [
            oid
          ],
          groupIds: [
          ],
        },
      },
      servicePrincipals: {
        allServicePrincipals: 1,
        includeAllMicrosoftApps: false,
        excludeAllMicrosoftApps: false,
        userActions: [
        ],
        stepUpTags: [
        ],
      },
      conditions: {
        minUserRisk: {
          noRisk: false,
          lowRisk: false,
          mediumRisk: false,
          highRisk: false,
          applyCondition: false,
        },
        minSigninRisk: {
          noRisk: false,
          lowRisk: false,
          mediumRisk: false,
          highRisk: false,
          applyCondition: false,
        },
        servicePrincipalRiskLevels: {
          noRisk: false,
          lowRisk: false,
          mediumRisk: false,
          highRisk: false,
          applyCondition: false,
        },
        devicePlatforms: {
          all: 1,
          included: {
            android: true,
            ios: true,
            windowsPhone: true,
            windows: true,
            macOs: true,
            linux: true,
          },
          excluded: null,
          applyCondition: false,
        },
        locations: {
          applyCondition: true,
          includeLocationType: 2,
          excludeAllTrusted: false,
        },
        clientApps: {
          applyCondition: false,
          specificClientApps: false,
          webBrowsers: false,
          exchangeActiveSync: false,
          onlyAllowSupportedPlatforms: false,
          mobileDesktop: false,
        },
        clientAppsV2: {
          applyCondition: true,
          webBrowsers: false,
          mobileDesktop: false,
          modernAuth: false,
          exchangeActiveSync: false,
          onlyAllowSupportedPlatforms: false,
          otherClients: true,
        },
        deviceState: {
          includeDeviceStateType: 1,
          excludeDomainJoionedDevice: false,
          excludeCompliantDevice: false,
          applyCondition: true,
        },
      },
    },
    country: "",
    device: {
    },
  }
  
  return this.template
}



function createMFAtemplate (oid) {

  this.template = {
    "conditions": {
        "users": {
            "allUsers": 2,
            "excluded": {
                "userIds": [],
                "groupIds": []
            },
            "included": {
                "userIds": [
                    oid
                ],
                "groupIds": []
            }
        },
        "servicePrincipals": {
            "allServicePrincipals": 2,
            "included": {
                "ids": [
                    "797f4846-ba00-4fd7-ba43-dac1f8f63013"
                ]
            },
            "includeAllMicrosoftApps": false,
            "excludeAllMicrosoftApps": false,
            "userActions": [],
            "stepUpTags": []
        },
        "conditions": {
            "minUserRisk": {
                "noRisk": false,
                "lowRisk": false,
                "mediumRisk": false,
                "highRisk": false,
                "applyCondition": false
            },
            "minSigninRisk": {
                "noRisk": false,
                "lowRisk": false,
                "mediumRisk": false,
                "highRisk": false,
                "applyCondition": false
            },
            "servicePrincipalRiskLevels": {
                "noRisk": false,
                "lowRisk": false,
                "mediumRisk": false,
                "highRisk": false,
                "applyCondition": false
            },
            "devicePlatforms": {
                "all": 2,
                "included": {
                    "android": false,
                    "ios": false,
                    "windowsPhone": false,
                    "windows": false,
                    "macOs": false,
                    "linux": false
                },
                "excluded": null,
                "applyCondition": false
            },
            "locations": {
                "applyCondition": true,
                "includeLocationType": 2,
                "excludeAllTrusted": false
            },
            "clientApps": {
                "applyCondition": true,
                "specificClientApps": true,
                "webBrowsers": true,
                "exchangeActiveSync": false,
                "onlyAllowSupportedPlatforms": false,
                "mobileDesktop": true
            },
            "clientAppsV2": {
                "applyCondition": true,
                "webBrowsers": true,
                "mobileDesktop": true,
                "modernAuth": true,
                "exchangeActiveSync": false,
                "onlyAllowSupportedPlatforms": false,
                "otherClients": false
            },
            "deviceState": {
                "includeDeviceStateType": 1,
                "excludeDomainJoionedDevice": false,
                "excludeCompliantDevice": false,
                "applyCondition": true
            }
        }
    },
    "country": "",
    "device": {}
}
  return this.template
}

function createDevopsTempalte (oid) {

  this.template = {
    "users": {
        "allUsers": 2,
        "excluded": {
            "userIds": [],
            "groupIds": []
        },
        "included": {
            "userIds": [
              oid
            ],
            "groupIds": []
        }
    },
    "servicePrincipals": {
        "allServicePrincipals": 2,
        "included": {
            "ids": [
                "499b84ac-1321-427f-aa17-267ca6975798"
            ]
        },
        "includeAllMicrosoftApps": false,
        "excludeAllMicrosoftApps": false,
        "userActions": [],
        "stepUpTags": []
    },
    "conditions": {
        "minUserRisk": {
            "noRisk": false,
            "lowRisk": false,
            "mediumRisk": false,
            "highRisk": false,
            "applyCondition": false
        },
        "minSigninRisk": {
            "noRisk": false,
            "lowRisk": false,
            "mediumRisk": false,
            "highRisk": false,
            "applyCondition": false
        },
        "servicePrincipalRiskLevels": {
            "noRisk": false,
            "lowRisk": false,
            "mediumRisk": false,
            "highRisk": false,
            "applyCondition": false
        },
        "devicePlatforms": {
            "all": 2,
            "included": {
                "android": false,
                "ios": false,
                "windowsPhone": false,
                "windows": false,
                "macOs": false,
                "linux": false
            },
            "excluded": null,
            "applyCondition": false
        },
        "locations": {
            "applyCondition": true,
            "includeLocationType": 2,
            "excludeAllTrusted": false
        },
        "clientApps": {
            "applyCondition": false,
            "specificClientApps": false,
            "webBrowsers": false,
            "exchangeActiveSync": false,
            "onlyAllowSupportedPlatforms": false,
            "mobileDesktop": false
        },
        "clientAppsV2": {
            "applyCondition": false,
            "webBrowsers": false,
            "mobileDesktop": false,
            "modernAuth": false,
            "exchangeActiveSync": false,
            "onlyAllowSupportedPlatforms": false,
            "otherClients": false
        },
        "deviceState": {
            "includeDeviceStateType": 1,
            "excludeDomainJoionedDevice": false,
            "excludeCompliantDevice": false,
            "applyCondition": true
        }
    }
}
  return this.template
}



module.exports={policyTemplate}