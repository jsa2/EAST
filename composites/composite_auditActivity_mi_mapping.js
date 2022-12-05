
// Creates a new map, no need to push the results
/* 
test(require('../content.json'))

 */

const { argv } = require('yargs')
const { inMemoryList } = require("../plugins/nodeSrc/inmemoryDb");


module.exports = async function (src) {


    let composite = inMemoryList(undefined, true)

    if (!composite || !argv.scanAuditLogs) {
        return;
    }

    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity")).filter(s => s?.metadata?.principalId?.principalId !== undefined)

    processed.map(sd => {
        let addedActivity = []
        sd.metadata.linkedActivity = composite.filter(s => s?.caller == sd?.metadata?.principalId?.principalId).map(s => {
            addedActivity.includes(JSON.stringify)
            return {
                operation: s?.operationName?.value,
                resource: s?.resourceId
            }
        })



    })


    return;



}





async function test(src) {


    let composite = src.find(s => s?.controlId == "adminsCa")

    if (!composite) {
        return;
    }

    let processed = src.filter(s => s.controlId.toLowerCase().match("managedidentity")).filter(s => s?.metadata?.principalId?.principalId !== undefined)

    processed.map(sd => {

        composite?.metadata?.results?.forEach(s => {

            if (s?.value.find(f => f?.oid == sd?.metadata?.principalId?.principalId)) {
                sd?.metadata.roles.push({
                    aadRole: s?.refInfo
                })
            }

        })



    })


    return;
}
