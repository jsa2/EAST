var path = require('path')

function getProviderApiVersion (item) {
var provider = item.split('providers')[1].split('/')[1]
var providersPath = path.resolve(`providers/${provider}/.apiVersion.json`)
return require(providersPath)
}

module.exports={getProviderApiVersion}