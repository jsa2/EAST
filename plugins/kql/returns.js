module.exports = {
    query:`
    securityresources | where type =~ "microsoft.security/assessments" 
    | extend source = // AssessmentsQueryBuilder.columnDefinitions.source - START
iff(type == "microsoft.security/assessments", trim(' ', tolower(tostring(properties.resourceDetails.Source))), dynamic(null))
// AssessmentsQueryBuilder.columnDefinitions.source - END
    | extend resourceId = // AssessmentsQueryBuilder.columnDefinitions.resourceId - START
iff(type == "microsoft.security/assessments", trim(" ", tolower(tostring(case(source =~ "azure", properties.resourceDetails.Id,
    // AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "aws" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - END
, properties.resourceDetails.Id,
    // AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "gcp" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - END
, properties.resourceDetails.Id,
    source =~ "aws", properties.resourceDetails.AzureResourceId,
    source =~ "gcp", properties.resourceDetails.AzureResourceId,
    extract("^(.+)/providers/Microsoft.Security/assessments/.+$",1,id)
    )))), dynamic(null))
// AssessmentsQueryBuilder.columnDefinitions.resourceId - END
    | extend nativeCloudAccountId = // AssessmentsQueryBuilder.columnDefinitions.nativeCloudAccountId - START
iff(type == "microsoft.security/assessments", trim(" ", tostring(case(source =~ "azure", "",
                                                (// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "aws" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - END
) or (// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "gcp" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - END
), properties.additionalData.HierarchyId,
                                                source =~ "aws", properties.resourceDetails.AccountId,
                                                source =~ "gcp", properties.resourceDetails.ProjectId,
                                                ""))), dynamic(null))
// AssessmentsQueryBuilder.columnDefinitions.nativeCloudAccountId - END
    | extend resourceName = // AssessmentsQueryBuilder.columnDefinitions.resourceName - START
iff(type == "microsoft.security/assessments", iff((// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "aws" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - END
) or (// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "gcp" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - END
), tostring(properties.additionalData.CloudNativeResourceName), extract(@"(.+)/(.+)", 2, resourceId)), dynamic(null))
// AssessmentsQueryBuilder.columnDefinitions.resourceName - END
    | extend multiCloudResourceType = // AssessmentsQueryBuilder.columnDefinitions.multicloudResourceType - START
iff(type == "microsoft.security/assessments", case((// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "aws" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - END
) or (// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "gcp" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - END
), strcat(properties.additionalData.ResourceProvider, "-", properties.additionalData.ResourceType),
        source =~ "aws" and resourceId startswith "AWS", extract(@"^AWS::::([^:]+)", 1, resourceId), 
        source =~ "aws", extract(@"^arn:aws:([^:]+)", 1, resourceId),
        source =~ "gcp", "GCP Resource",
        ""), dynamic(null))
// AssessmentsQueryBuilder.columnDefinitions.multicloudResourceType - END
    | extend regexResourceId = extract_all(@"/providers/([^/]+)(?:/([^/]+)/[^/]+(?:/([^/]+)/[^/]+)?)?/([^/]+)/[^/]+$", resourceId)
    | extend RegexResourceType = regexResourceId[0]
    | extend mainType = RegexResourceType[1], extendedType = RegexResourceType[2], resourceType = RegexResourceType[3]
    | extend providerName = RegexResourceType[0],
             mainType = case(mainType !~ "", strcat("/",mainType), ""),
             extendedType = case(extendedType!~ "", strcat("/",extendedType), ""),
             resourceType = case(resourceType!~ "", strcat("/",resourceType), "")
    | extend typeFullPath = // AssessmentsQueryBuilder.columnDefinitions.typeFullPath - START
iff(type == "microsoft.security/assessments", case(
        array_length(split(resourceId, '/')) == 3, 'subscription',
        array_length(split(resourceId, '/')) == 5, 'resourcegroups',
        // AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "gcp" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newGcpAssessmentIndicator - END
 or // AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - START
(type == "microsoft.security/assessments" and (source =~ "aws" and isnotempty(tostring(properties.resourceDetails.ConnectorId))))
// AssessmentsQueryBuilder.predicates.newAwsAssessmentIndicator - END
, tolower(strcat(providerName, mainType, "/", tostring(properties.additionalData.ResourceProvider), tostring(properties.additionalData.ResourceType))),
        strcat(providerName, mainType, extendedType, resourceType)), dynamic(null))
// AssessmentsQueryBuilder.columnDefinitions.typeFullPath - END
    | extend azureResourceType = case(isnotempty(resourceType), tolower(trim("/", resourceType)), "Subscription")
    | extend resourceType = case(isnotempty(multiCloudResourceType), multiCloudResourceType, azureResourceType)
    | extend assessmentKey = name
    | extend techniques = case(isnotempty(tostring(properties.metadata.techniques)), tostring(properties.metadata.techniques), "")
    | extend tactics = case(isnotempty(tostring(properties.metadata.tactics)), tostring(properties.metadata.tactics), "")
    | join kind=leftouter (
        securityresources
        | where type == "microsoft.security/securescores/securescorecontrols"
        | extend controlName = tostring(properties.displayName)
        | extend controlKey = tostring(name)
        | extend assessmentDefinitions = properties.definition.properties.assessmentDefinitions
        | mvexpand assessmentDefinitions
        | parse assessmentDefinitions with '{"id":"/providers/Microsoft.Security/assessmentMetadata/'assessmentKey'"}'
        | extend assessmentKey = tostring(assessmentKey)
        | summarize controlName= max(controlName) by controlKey, assessmentKey, subscriptionId
        | extend packControls = pack(controlName, controlKey)
        | summarize controls = make_bag(packControls) by assessmentKey,subscriptionId
        ) on assessmentKey, subscriptionId | where resourceId =~ "/subscriptions/6ce35563-bd22-4302-9c3e-d61dfb9630bc/resourceGroups/RGVirtualMachines/providers/Microsoft.Compute/virtualMachines/SAO-DC01"
| extend assessmentStatusCode = properties.status.code
| where assessmentStatusCode =~ "unhealthy"
    | order by name`
}