const axios = require('axios')
const qs = require('querystring')
const {getToken} = require('./getToken')
const chalk = require('chalk')
var waitT = require('util').promisify(setTimeout)

async function azNodeRestRef (ID, apiversion, debug, customOptions, urlencoded,reference,throttleCount) {

if (throttleCount % 3 == 0) {
console.log('waiting to avoid throttling for request number', throttleCount)
await waitT(1000)
}    

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
    
    if (throttleCount % 3 == 0) {
        console.log('Got response for request number', throttleCount)
        }    
    
    //console.log(data?.statusText)
    if (reference) {
        return {reference, data:data?.data}
    }
    return data?.data

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min) }


async function azNodeRestRefDyn2 (ID, apiversion, debug, customOptions, urlencoded,reference,throttleCount, dynAwaitInMS) {

 
    let waitTime = getRandomInt(500,2500)

    let actual = throttleCount * (dynAwaitInMS || waitTime)

    if (throttleCount % 1 == 0) {
    console.log('waiting to avoid throttling for request number', throttleCount)
    
    
    
    console.log('throttle is in MS:', actual)

    /* 
    if (actual % 3000 == 0 ) {
        console.log('waiting reseting dynamic await at', actual)
        dynAwaitInMS = 60
    } */
        
    console.log('doing dynamic await', actual)
    await waitT(actual)
    console.log('await done')
    }    

  
    
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
    
        let additionalWait 
        let data
        data = await axios(options).catch((error) => {
        var desc = "no provider"
            if (ID) { desc = ID.split('providers')[1]}  
            if (error?.response?.status == 429) {
                console.log('throttled, try once more')
                additionalWait = true
            } else {
                return Promise.reject(
                    {error:error?.response?.statusText,
                    request:desc,
                    url:options.url,
                    errorBody:error?.response?.data || "no data"
                    })
            }
            
        })

        if (additionalWait) {
            console.log
            await waitT(actual)
            
            data = await axios(options).catch((error) => {
                var desc = "no provider"
                    if (ID) { desc = ID.split('providers')[1]}  
                    return Promise.reject(
                        {error:error?.response?.statusText,
                        request:desc,
                        url:options.url,
                        errorBody:error?.response?.data || "no data"
                        })
            
                })
        }
        
        
    
        console.log('request done for', throttleCount, 'let throttle of', actual)
        if (reference) {
            return {reference, data:data?.data}
        }
        return data?.data
    
    }


async function axiosThrottle (options,throttleCount) {

    
    let actual = throttleCount * dynAwaitInMS

    if (throttleCount % 2 == 0) {
    console.log('waiting to avoid throttling for request number', throttleCount)
    }
    
    console.log('throttle is in MS:', actual)
        console.log('checking pipelines',options.url)
    try {  let  {data} = await axios(options) 
        return data
    }
    catch (error) {
        return error
    }
  

}


var dynAwaitInMS = 100
async function azNodeRestRefDyn (ID, apiversion, debug, customOptions, urlencoded,reference,throttleCount) {

 
    let actual = throttleCount * dynAwaitInMS

    if (throttleCount % 2 == 0) {
    console.log('waiting to avoid throttling for request number', throttleCount)
    
    
    
    console.log('throttle is in MS:', actual)

    /* 
    if (actual % 3000 == 0 ) {
        console.log('waiting reseting dynamic await at', actual)
        dynAwaitInMS = 60
    } */
        
    console.log('doing dynamic await', actual)
    await waitT(actual)
    console.log('await done')
    }    

  
    
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
        
    
        console.log('request done for', throttleCount, 'let throttle of', actual)
        if (reference) {
            return {reference, data:data?.data}
        }
        return data?.data
    
    }


async function axiosThrottle (options,throttleCount) {

    
    let actual = throttleCount * dynAwaitInMS

    if (throttleCount % 2 == 0) {
    console.log('waiting to avoid throttling for request number', throttleCount)
    }
    
    console.log('throttle is in MS:', actual)
        console.log('checking pipelines',options.url)
    try {  let  {data} = await axios(options) 
        return data
    }
    catch (error) {
        return error
    }
  

}



    


module.exports = {azNodeRestRef,azNodeRestRefDyn,axiosThrottle,azNodeRestRefDyn2,getRandomInt}