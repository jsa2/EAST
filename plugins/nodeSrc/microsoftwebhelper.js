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

module.exports={checkDoesItApply}