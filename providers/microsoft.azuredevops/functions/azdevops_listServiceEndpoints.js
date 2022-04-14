

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

let {data:projects}  = data
//
let promiseArra = []
let count = 0
projects.value.map( ep => {
    count++
        let options ={
            url:`https://dev.azure.com/${argv.azdevops}/${ep?.name}/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4`,
            headers:{
                authorization: `Bearer ${tkn}`
            }
        }
        promiseArra.push(axiosThrottle(options, count))
        
    })

let endpoints = await (await Promise.all(promiseArra)).filter(s => s !== undefined)



returnObject.metadata={endpoints} 
returnObject.isHealthy="review"
return returnObject

}


