const path = require('path')
function checkSubProvider (provider) {

    try {
    let provP = provider.split('providers')[1].split('/')[1] + '/' +provider.split('providers')[1].split('/')[2]
    let proPath = path.resolve(`./providers/${provP}/.apiVersion.json`)
    let {apiversion} = require(proPath)
    return apiversion
} catch (error) {
    let provNative = provider.split('providers')[1].split('/')[1]
    let proPath = path.resolve(`./providers/${provNative}/.apiVersion.json`)
    let {apiversion} = require(proPath)
    return apiversion
}
 

    

}

function checkSubProviderResource (data) {

    try {
    let provP = data.id.split('providers')[1].split('/')[1] + '/' +data.id.split('providers')[1].split('/')[2]
   // Look for additional API file if the subprovider exists
    require('fs').readFileSync(path.resolve(`./providers/${provP}/.apiVersion.json`))
    let provider = `${data.type.split('/')[0]}/${data.type.split('/')[1]}`

    return provider
} catch (error) {
    let provider = data.type.split('/')[0]
    return provider
}
 

    

}

module.exports={checkSubProvider,checkSubProviderResource}