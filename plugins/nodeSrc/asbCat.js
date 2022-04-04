
const { default: axios } = require("axios");
const { responseSchema } = require("./functionResponseSchema");
const { getToken } = require("./getToken");


const query = require("./query");



var sub = [
    "3539c2a2-cd25-48c6-b295-14e59334ef1c",
    "6193053b-408b-44d0-b20f-4e29b9b67394",
    "6c052e74-e3b3-401b-8734-fafc98c8cf83"
]

//resourceGraphGovernanceData(sub).then((data) => console.log(data))

//max unitsize is 1000
var unitSize = 1000

async function resourceGraphGovernanceDataCat (subscriptions) {


    var token = await getToken()
    var data = {
        subscriptions,
        "options": {
            "$skip": 0,
            "$top": unitSize,
            "$skipToken": "",
            resultFormat: "ObjectArray"
        },
        query:query.query
    }

    var options = {
        method:"post",
        url:'https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2018-09-01-preview',
        headers: {authorization: `Bearer ${token}`},
        data,
    }
    
     await govData(options)
     var asbR =[]
     results.map((item) => {
 
        if ( item.complianceState.toLowerCase() == "failed") {
            item.isHealthy=false
        } else {
            item.isHealthy=true
        }

    
       asbR.push (new responseSchema({
            id:item.resourceId,
            isHealthy:item.isHealthy,
            name: `ASB_${item.recommendationDisplayName.replace(new RegExp(' ','g'),'_')}`,
            fileName:`ASB_${item.recommendationDisplayName.replace(new RegExp(' ','g'),'_')}`,
            metadata:{asb:JSON.stringify(item)}
        },{Description:item.description}))
       // return response

    }) 

     return asbR
}

var batch = []
var i = 0
var results = []


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



module.exports={resourceGraphGovernanceDataCat}

