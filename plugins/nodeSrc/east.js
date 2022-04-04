const axios = require('axios')
const qs = require('querystring')
const {getToken} = require('./getToken')
const chalk = require('chalk')

async function AzNodeRest (ID, apiversion, debug, customOptions, urlencoded) {

var token = await getToken()

var headers = {
    "Authorization": "Bearer " + token,
    "content-type": "application/json"
  }



    //console.log(options.url)

if (customOptions) {
    var options = customOptions
    //If uses https://management.core.windows.net/
    if (!options?.headers?.Authorization) {
        options.headers = {}
        options.headers.Authorization =  `Bearer ${token}`
    }
} else {

    if (ID.match("[?]")) {
        var apiv = `&api-version=${apiversion}`
       } else {
           var apiv = `?api-version=${apiversion}`
       }
       
       var options = {
           url:`https://management.azure.com${ID}${apiv}`,
           headers
           }
}
/* console.log(chalk.green(options.url))
console.log(options.url) */
    if (urlencoded == true) {
        options.data = qs.stringify(options.data)
    }
    if (debug) {
        console.log(options)
    }

    //console.log(options)

    var data = await axios(options).catch((error) => {
    var desc = "no provider"
        if (ID) { desc = ID.split('providers')[1]}  
        return Promise.reject(
            {error:error?.response?.statusText,
            request:desc,
            url:options.url,
            errorBody:error?.response?.data || "no data"
            })

    })
    
    //console.log(data?.statusText)
    return data?.data

}


module.exports = {AzNodeRest}