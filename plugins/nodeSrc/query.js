module.exports = {
    query:`securityresources
    | where type == "microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments"
    | extend complianceStandardId = replace( "-", " ", extract(@'/regulatoryComplianceStandards/([^/]*)', 1, id))
    | where complianceStandardId ==  "Azure Security Benchmark"
    | extend failedResources = toint(properties.failedResources), passedResources = toint(properties.passedResources),skippedResources = toint(properties.skippedResources)
    | where failedResources + passedResources + skippedResources > 0 or properties.assessmentType == "MicrosoftManaged"
    | join kind = leftouter(
    securityresources
    | where type == "microsoft.security/assessments") on subscriptionId, name
    | extend complianceState = tostring(properties.state)
    | extend resourceSource = tolower(tostring(properties1.resourceDetails.Source))
    | extend recommendationId = iff(isnull(id1) or isempty(id1), id, id1)
    | extend resourceId = trim(' ', tolower(tostring(case(resourceSource =~ 'azure', properties1.resourceDetails.Id,
                                                        resourceSource =~ 'gcp', properties1.resourceDetails.GcpResourceId,
                                                        resourceSource =~ 'aws' and isnotempty(tostring(properties1.resourceDetails.ConnectorId)), properties1.resourceDetails.Id,
                                                        resourceSource =~ 'aws', properties1.resourceDetails.AwsResourceId,
                                                        extract('^(.+)/providers/Microsoft.Security/assessments/.+$',1,recommendationId)))))
    | extend regexResourceId = extract_all(@"/providers/[^/]+(?:/([^/]+)/[^/]+(?:/[^/]+/[^/]+)?)?/([^/]+)/([^/]+)$", resourceId)[0]
    | extend resourceType = iff(resourceSource =~ "aws" and isnotempty(tostring(properties1.resourceDetails.ConnectorId)), tostring(properties1.additionalData.ResourceType), iff(regexResourceId[1] != "", regexResourceId[1], iff(regexResourceId[0] != "", regexResourceId[0], "subscriptions")))
    | extend resourceName = tostring(regexResourceId[2])
    | extend recommendationName = name
    | extend recommendationDisplayName = tostring(iff(isnull(properties1.displayName) or isempty(properties1.displayName), properties.description, properties1.displayName))
    | extend description = tostring(properties1.metadata.description)
    | extend remediationSteps = tostring(properties1.metadata.remediationDescription)
    | extend severity = tostring(properties1.metadata.severity)
    | extend azurePortalRecommendationLink = tostring(properties1.links.azurePortal)
    | extend complianceStandardId = replace( "-", " ", extract(@'/regulatoryComplianceStandards/([^/]*)', 1, id))
    | extend complianceControlId = extract(@"/regulatoryComplianceControls/([^/]*)", 1, id)
    | mvexpand statusPerInitiative = properties1.statusPerInitiative
                | extend expectedInitiative = statusPerInitiative.policyInitiativeName =~ "ASC Default"
                | summarize arg_max(expectedInitiative, *) by complianceControlId, recommendationId
                | extend state = iff(expectedInitiative, tolower(statusPerInitiative.assessmentStatus.code), tolower(properties1.status.code))
                | extend notApplicableReason = iff(expectedInitiative, tostring(statusPerInitiative.assessmentStatus.cause), tostring(properties1.status.cause))
                | project-away expectedInitiative
    | project complianceStandardId, complianceControlId, complianceState, subscriptionId, resourceGroup = resourceGroup1 ,resourceType, resourceName, resourceId, recommendationId, recommendationName, recommendationDisplayName, description, remediationSteps, severity, state, notApplicableReason, azurePortalRecommendationLink
    | join kind = leftouter (securityresources
    | where type == "microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols"
    | extend complianceStandardId = replace( "-", " ", extract(@'/regulatoryComplianceStandards/([^/]*)', 1, id))
    | where complianceStandardId == "Azure Security Benchmark"
    | extend  controlName = tostring(properties.description)
    | project controlId = name, controlName
    | distinct  *) on $right.controlId == $left.complianceControlId
    | project-away controlId
    | distinct *
    | order by complianceControlId asc, recommendationId asc`
}