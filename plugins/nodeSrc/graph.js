
const { axiosClient } = require('./axioshelpers')


const pre= []

async function graph2 (token, url) {


    var exists = pre.find(item => item.url == url)
    if (exists) {
        console.log('found existing')
        return exists.data
    }
    console.log('checking', url)

        var options = {
            responseType: 'json',
            "method": "get",
            url,
            headers:{
                'content-type':"application/json",
                authorization:"bearer " + token
            },
          /*   timeout:2000 */
        }

    options
    var errorProp 
    var data = await axiosClient(options).catch((error) => {
        errorProp = error
        console.log('Object not in graph')
    })

    var data = (data?.value || data) || "object not in graph"

        pre.push({url:options.url,data:data})
    
    return data

}

async function graph (token, operation) {

    console.log('checking', operation)

        var options = {
            responseType: 'json',
            "method": "get",
            url:`https://graph.microsoft.com/v1.0/${operation}`,
            headers:{
                'content-type':"application/json",
                authorization:"bearer " + token
            },
          /*   timeout:2000 */
        }

    options
    var data = await axiosClient(options).catch((error) => {
        return Promise.reject(error)
    })

    return data?.value || data

}

async function genericGraph2 (options) {
    // console.log(options.url)
  if (options?.refInfo) {
      var {refInfo} = options
      delete options.refInfo
  }
     var data = await axiosClient(options).catch((error) => {
         return Promise.reject(error)
     })
 
     if (refInfo) {
         data.refInfo=refInfo
         if (data.value.length >0) {
             return {
                 owner:data?.value,
                 refInfo
             }
         }
         return {}
     } else {
         return data
     }
     }

async function genericGraph (options) {
   // console.log(options.url)
 if (options?.refInfo) {
     var {refInfo} = options
     delete options.refInfo
 }
    var data = await axiosClient(options).catch((error) => {
        return Promise.reject(error)
    })

    if (refInfo) {
        data.refInfo=refInfo
        return data
    } else {
        return data
    }
    }
   


async function graphOwner (token, operation,appId) {

    console.log('checking', operation)

        var options = {
            responseType: 'json',
            "method": "get",
            url:`https://graph.microsoft.com/v1.0/${operation}`,
            headers:{
                'content-type':"application/json",
                authorization:"bearer " + token['access_token']
            },
          /*   timeout:2000 */
        }

    options
    var data = await axiosClient(options).catch((error) => {
        return Promise.reject(error)
    })

    return {userPrincipalName:data?.value, appId} || data

}



async function graphListS (token, operation, skiptoken, responseCollector) {

    var options = {
        responseType: 'json',
        "method": "get",
        url:`https://graph.microsoft.com/beta/${operation}`,
        headers:{
            'content-type':"application/json",
            authorization:"bearer " + token['access_token']
        }
    }

    if (skiptoken) {
        options.url = skiptoken
    }

var data = await axiosClient(options).catch((error) => {
    return Promise.reject(error)
})


if (data['@odata.nextLink']) {
    console.log('getting results:',data.value.length)
    data.value.forEach((item) => responseCollector.push(item))
    console.log(data['@odata.nextLink'])
    await graphListS(token,operation,data['@odata.nextLink'],responseCollector)

}
else {
   return data.value.forEach((item) => responseCollector.push(item))
}

}



async function graphList (token, operation, skiptoken, responseCollector) {

        var options = {
            responseType: 'json',
            "method": "get",
            url:`https://graph.microsoft.com/v1.0/${operation}`,
            headers:{
                'content-type':"application/json",
                authorization:"Bearer " + token
            }
        }
    
        if (skiptoken) {
            options.url = skiptoken
        }

    var data = await axiosClient(options).catch((error) => {
        return Promise.reject(error)
    })


    if (data['@odata.nextLink']) {
        data.value.forEach((item) => responseCollector.push(item))
        console.log(data['@odata.nextLink'])
        await graphList(token,operation,data['@odata.nextLink'],responseCollector)

    }
    else {
       return data.value.forEach((item) => responseCollector.push(item))
    }

}



var waitT = require('util').promisify(setTimeout)

async function batchThrottled (run, burstCount, arrayOfObjects, token) {

var promArra = []
var returnObject = []
let i = 0

    for await (item of arrayOfObjects) {
        i++
        console.log(i)

        if (i % burstCount == 0) {
            await waitT(1000)
        }

        promArra.push(
            run(item,token).catch((error) => {
                returnObject.push(item.error = error)
            }).then((data) => {
                console.log(data)
                returnObject.push(data)
            })
        )

    }

await Promise.all(promArra)
return returnObject

}





module.exports={graph, graphList, batchThrottled,graphOwner,graphListS,genericGraph,graph2,genericGraph2}