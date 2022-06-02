function checkDoesItApply (item,returnObject) {

    if (!item?.type.match('microsoft.web/sites') || item?.id.match('certificates') ) {
        if (!returnObject) {
            returnObject={}
        }
        returnObject.metadata = item?.properties
        returnObject.isHealthy="notApplicable"
        return returnObject
    } else {
        return undefined}

}

function checkDoesItApplyFn (item,returnObject) {

    if (!item?.kind.match('functionapp') ) {
        if (!returnObject) {
            returnObject={}
        }
        returnObject.metadata = item?.properties
        returnObject.isHealthy="notApplicable"
        return returnObject
    } else {
        return undefined}

}

function checkDoesItApplyWorkflowApp (item,returnObject) {


    if (!item?.kind) {

        if (!returnObject) {
            returnObject={}
        }
        returnObject.metadata = item?.properties
        returnObject.isHealthy="notApplicable"
        return returnObject

    }


    if (!item?.kind.match('workflowapp') || item?.id.match('certificates') ) {
        if (!returnObject) {
            returnObject={}
        }
        returnObject.metadata = item?.properties
        returnObject.isHealthy="notApplicable"
        return returnObject
    } else {
        return undefined}

}


module.exports={checkDoesItApply,checkDoesItApplyWorkflowApp,checkDoesItApplyFn}