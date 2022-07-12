
var fs = require('fs')
const { decode } = require("jsonwebtoken")
var path = require('path')

async function getToken() {

    try {

        const token = require('../session/sessionToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --resource=https://management.azure.com --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/sessionToken.json'),JSON.stringify(token))
        return token || error

    }


}


async function getGraphToken() {

    try {

        const token = require('../session/graphToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --scope=https://graph.microsoft.com/Directory.AccessAsUser.All --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/graphToken.json'),JSON.stringify(token))
        return token || error

    }


}

async function getGraphTokenReducedScope() {

    try {

        const token = require('../session/graphToken2.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --scope=https://graph.microsoft.com/Directory.AccessAsUser.All --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/graphToken2.json'),JSON.stringify(token))
        return token || error

    }


}


async function getAADtoken() {

    try {

        const token = require('../session/aadToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --resource=https://graph.windows.net --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/aadToken.json'),JSON.stringify(token))
        return token || error

    }


}

async function getAADIamToken() {

    try {

        const token = require('../session/iamToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --resource=74658136-14ec-4630-ad9b-26e160ff0fc6 --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/iamToken.json'),JSON.stringify(token))
        return token || error

    }


}


async function getAKStoken () {

    try {

        const token = require('../session/aksToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --resource=6dae42f8-4368-4678-94ff-3960e28e3630 --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/aksToken.json'),JSON.stringify(token))
        return token || error

    }


}


async function getAzDevopsToken() {

    try {

        const token = require('../session/azdevopsToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --resource=499b84ac-1321-427f-aa17-267ca6975798 --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/azdevopsToken.json'),JSON.stringify(token))
        return token || error

    }


}



async function getLaAPItoken () {

    try {

        const token = require('../session/laApiToken.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {
        var token = await require('../pluginRunner').runner('az account get-access-token --resource=ca7f3f0b-7d91-482c-8e09-c5d840d0eac5 --query accessToken --output json')
        fs.writeFileSync(path.join('plugins','/session/laApiToken.json'),JSON.stringify(token))
        return token || error

    }


}

module.exports={getToken,getGraphToken,getAADtoken,getAADIamToken, getGraphTokenReducedScope,getAKStoken,getAzDevopsToken,getLaAPItoken}