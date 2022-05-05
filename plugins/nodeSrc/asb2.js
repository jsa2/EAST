var {query} = require('./query');

const { argv } = require('yargs')
const { default: axios } = require("axios");
const { getToken } = require('./getToken');
const { responseSchema } = require('./functionResponseSchema');


var sub = [
    "3539c2a2-cd25-48c6-b295-14e59334ef1c",
    "6193053b-408b-44d0-b20f-4e29b9b67394",
    "6c052e74-e3b3-401b-8734-fafc98c8cf83"
]

//resourceGraphGovernanceData(sub).then((data) => console.log(data))

//max unitsize is 1000
var unitSize = 1000

async function resourceGraphGovernanceData2 (subscriptions) {

    if (argv?.subInclude) {
        subscriptions = argv.subInclude.split(',')
    }


    var token = await getToken()
    var data = {
        subscriptions,
        "options": {
            "$skip": 0,
            "$top": unitSize,
            "$skipToken": "",
            resultFormat: "ObjectArray"
        },
        query:`  securityresources
        | where type == "microsoft.security/assessments"`
    }

    var options = {
        method:"post",
        url:'https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2018-09-01-preview',
        headers: {authorization: `Bearer ${token}`},
        data,
    }
    
     await govData(options)
     var asbR =[]
     require('fs').writeFileSync('qr.json',JSON.stringify(results))
     var s = results.filter( item => item.properties.displayName == undefined)
     results.filter(item => item.properties.status.code.toLowerCase() !== "notapplicable" && item.properties.displayName).map((item) => {
 
        if ( item.properties.status.code.toLowerCase() == "healthy") {
            item.isHealthy=true
        } else {
            item.isHealthy=false
        }


       
    
       asbR.push (new responseSchema({
            id:item.properties.resourceDetails.Id,
            isHealthy:item.isHealthy,
            name: `ASB_${ item.properties.displayName.replace(new RegExp(' ','g'),'_')}`,
            fileName:`ASB_${ item.properties.displayName.replace(new RegExp(' ','g'),'_')}`,
            metadata:{asb:JSON.stringify(item.properties)}
        },{Description:item.properties.metadata.description}))
       // return response

    }) 

     return asbR
}

var batch = []
var i = 0
var results = []

async function govData (options) {

    var skip =unitSize 
    var {data} = await axios(options)
    if (data.data.length  == 0) {
        return []
    }
    if (data.totalRecords < unitSize) {
        data.data.forEach(item => results.push(item))
        return
    }
    var {totalRecords} =data 
    data.data.forEach((item) => results.push(item))

    var last = totalRecords % unitSize

    
    var batchCount = (totalRecords -unitSize - last) / unitSize
    if (batchCount > 0)
    do  {
        i++
        batch.push(unitSize)
        console.log(batch)
    } while (i !== batchCount)
    batch.push(last)
    for await (unit of batch) {
        console.log(skip)
    options.data.options['$skip']=skip
    var {data} = await axios(options)
    var {totalRecords} =data 
    skip= skip + unit
    data.data.forEach((item) => results.push(item))
    }

 }



module.exports={resourceGraphGovernanceData2}

