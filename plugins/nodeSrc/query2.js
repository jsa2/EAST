module.exports = {
    query:`  securityresources
    | where type == "microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments"
    | extend complianceStandardId = replace( "-", " ", extract(@'/regulatoryComplianceStandards/([^/]*)', 1, id))
    | where complianceStandardId ==  "Azure Security Benchmark"`
}