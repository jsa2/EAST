

const { default: axios } = require("axios")
const {argv} = require('yargs')
const { getAzDevopsToken } = require("../../../plugins/nodeSrc/getToken")
const { axiosThrottle } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)


let tkn  =await getAzDevopsToken()



let data = await axios({
    url:`https://dev.azure.com/${argv.azdevops}/_apis/projects?api-version=2.0`,
    headers:{
        authorization: `Bearer ${tkn}`
    }
}).catch( e => {
    console.log(e)
})

if (!data) {
    returnObject.metadata={status:"no project access to Azure Devops"} 
    returnObject.isHealthy="not applicable"
    return returnObject
    }

let {data:pipelines}  = data
//
let promiseArra = []
let count = 0
pipelines?.value.map( ep => {
    count++
        let options ={
            url:`https://dev.azure.com/${argv.azdevops}/${ep?.name}/_apis/pipelines?api-version=6.0-preview.1`,
            headers:{
                authorization: `Bearer ${tkn}`
            }
        }
        promiseArra.push(axiosThrottle(options, count))
        
    })



let listRuns = await (await Promise.all(promiseArra)).filter(s => s !== undefined)

let promiseArra2 = []

listRuns.map( line => {
    line?.value.map( ep => {
        count++
        let url = ep.url.split('?')[0] + "/runs?api-version=6.0-preview.1"
            let options ={
                url,
                headers:{
                    authorization: `Bearer ${tkn}`
                }
            }
            promiseArra2.push(axiosThrottle(options, count))
            
        })
})

let pipelineRuns = await (await Promise.all(promiseArra2)).filter(s => s !== undefined)

let promiseArra3 = []

console.log(pipelineRuns)


pipelineRuns.map( run => {
    run?.value.splice(0,10).map( ep => {
        count++
        let url = ep.url + "/logs?$expand=signedContent&api-version=6.0-preview.1"
            let options ={
                url,
                headers:{
                    authorization: `Bearer ${tkn}`
                }
            }
            promiseArra3.push(axiosThrottle(options, count))
            
        })
})

let logs = await (await Promise.all(promiseArra3)).filter(s => s !== undefined)

let promiseArra4 = []
logs.map( run => {
    run?.logs.map( ep => {
        count++
        let url = ep?.signedContent?.url
            let options ={
                responseType: 'arraybuffer', 
                decompress: true,
                url,
                headers:{
                    authorization: `Bearer ${tkn}`
                }
            }
            promiseArra4.push(axiosThrottle(options, count))
            
        })
})

let logResults = await (await Promise.all(promiseArra4)).filter(s => s !== undefined).map(s => {
    try {
        let logStreamToString = Buffer.from(s).toString('ascii')

        let matchLikelySecrets = require('../../../plugins/other/wordlist.json').values.split(',').map(word => {
            srs = logStreamToString.toLowerCase().match(word.toLowerCase())
           // let srs2 = JSON.stringify(item.properties.definition).toLowerCase().match(new RegExp("\\?code",'g'))

           if (word == "secret" && srs) {
               console.log()
           }

         if (srs) {
            returnObject.isHealthy="review"
         }
           return srs
        }).filter(is => is !== null).map(s => {
            let wmatch = `${s[0]}:${s.input.substring(s.index-30,s.index+300)} \r\n`
            require('fs').appendFileSync('secrets.txt',wmatch)
            require('fs').appendFileSync('secrets.txt',`\r\n`)
            require('fs').appendFileSync('secrets.txt',logStreamToString)
            return {
                wordMatch: `${s[0]}:${s.input.substring(s.index-30,s.index+300)}`,
                start: `${s[0]}:${logStreamToString.substring(0,500)}`
            }

        })
        return  matchLikelySecrets
    }
    catch (error) {
        return "Error: Unable to form logs from buffer"
    }
})

try {
    logResults = logResults.flat()
} catch (error) {
    console.log('cannot flatten array')
}

returnObject.metadata={logResults} 
returnObject.isHealthy="review"
return returnObject

}


