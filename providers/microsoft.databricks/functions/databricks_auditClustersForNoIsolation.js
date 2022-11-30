

// auditing module for databricks
const { default: axios } = require("axios")
const { argv } = require("yargs")
const { getDataBricksToken } = require("../../../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

module.exports = async function (item) {

    let returnObject = new returnObjectInit(item, __filename.split('/').pop())

    returnObject.isHealthy = true
    let tkn = argv?.alternativeAuthforADB || await getDataBricksToken()

    let options = {
        url: `https://${item.properties?.workspaceUrl}/api/2.0/clusters/list`,
        headers: {
            authorization: `Bearer ${tkn}`
        }
    }

    try {
        let { data } = await axios(options)

        // Changes the isHealthy flag to review, when particular cluster type is found
        if (data?.clusters.find(a => a?.data_security_mode == 'none' || a?.data_security_mode == 'LEGACY_SINGLE_USER_STANDARD')) {
            returnObject.isHealthy = "review"
        }

        // If no additional attach permissions are given, then the flag is turned back to healthy
        // Code commented out as it requires beyond reader permissions to determine the status
       /*  for await (let clu of data?.clusters) {

            let options = {
                url: `https://${item.properties?.workspaceUrl}/api/2.0/preview/permissions/clusters/${clu?.cluster_id}`,
                headers: {
                    authorization: `Bearer ${tkn}`
                }
            }

            let c = await axios(options)
             
            console.log(clust)
        }
 */
        // Lists security modes for the reprot
        let security_mode = data?.clusters?.map(a => `${a.cluster_name}:${a.data_security_mode}`)

        returnObject.metadata = { security_mode: security_mode || 'no clusters' }


    } catch (error) {

        returnObject.isHealthy = "manual"
        returnObject.metadata = {error:`status:${error?.response?.status} - user likely not authorized`}

    }


    return returnObject

}


