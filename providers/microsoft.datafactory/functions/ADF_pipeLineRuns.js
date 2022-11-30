


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { azNodeRestRef, azNodeRestRefDyn } = require("../../../plugins/nodeSrc/nodeRestRef")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

var {apiversion} = getProviderApiVersion(item.id)

returnObject.isHealthy = "review"

var d1 = new Date (),
d2 = new Date ( d1 )
d2.setHours ( d1.getHours() - 168 );
var lastUpdatedAfter = d2.toISOString()
var lastUpdatedBefore = d1.toISOString()

var opt ={
    method:"post",
    url:`https://management.azure.com/${item.id}/queryPipelineRuns?api-version=2018-06-01`,
    data:{
        "filters": [
            {
                "operand": "LatestOnly",
                "operator": "Equals",
                "values": [
                    true
                ]
            }
        ],
        "orderBy": [
            {
                "orderBy": "RunStart",
                "order": "DESC"
            }
        ],
       lastUpdatedAfter,
       lastUpdatedBefore,
    }
}

var {value:runs} = await AzNodeRest(undefined,undefined,undefined,opt)
const promiseR =[]
var throttleCount = 1



runs.map(run => {
    let runOpt = {
        method:"POST",
        url:`https://management.azure.com${run.id.toLowerCase()}/queryactivityruns?api-version=2018-06-01`,
        data:{
            "filters": [],
            "orderBy": [
                {
                    "orderBy": "ActivityRunStart",
                    "order": "DESC"
                }
            ],
            lastUpdatedAfter,
            lastUpdatedBefore,
        }
    }
    promiseR.push(azNodeRestRefDyn(undefined,undefined,undefined,runOpt,undefined,{},throttleCount))
})

const runResults = await Promise.all(promiseR)

const withIO = []
 runResults.filter( its => {
    its.data.value.filter(io => io?.input || io?.output ).map(s => withIO.push(`_:_${s.pipelineName}:${s.activityName}:${s.pipelineRunId}_:_${JSON.stringify(s?.input)} ${JSON.stringify(s?.output)}`))
})

let newr = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,'g')

let matchPw = JSON.stringify(withIO).split('\"').filter(s => s.length > 8).map(s => s.match(newr))

let returnPw = matchPw.filter(s => s !== null)


let checkers= []
let news = new Set(returnPw)

for (ent of news) {
  let s =  ent[0].split("\\") || []
  if (s[0].match(newr)) {
    checkers.push(s[0])
  }

}



let srs 
let sqlInput

let matchLikelySecrets = require('../../../plugins/other/wordlist.json').values.split(',').map(word => {
    srs = JSON.stringify(withIO).toLowerCase().match(word.toLowerCase())
    
    if (word == "SELECT" && srs) {
        sqlInput =  `${srs?.input.split('_:_')[1]}:${srs?.input.substring(srs?.index,srs?.index+300)}`
    } 


    if (word.toLowerCase() == "accountkey") {
    console.log()
    }
    return srs
}).filter(is => is !== null).map(s => `${s.input.split('_:_')[1]}:${s.input.substring(s.index-50,s.index+300)}`)


returnObject.metadata = {sqlInput,matchLikelySecrets,returnPw:`first 300 characters: ${checkers.toString().substring(0,300)}`}
//console.log(stashOrig)

return returnObject

}


