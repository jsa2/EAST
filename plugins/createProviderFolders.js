const {exec} =require('child_process')
const fs = require('fs')
const wexc = require('util').promisify(exec)
const path = require('path')


main(`az provider list  -o tsv --query [].id -o json`)

async function main (script) {
    var {stdout} = await wexc(script) 
    schemaPayload = JSON.parse(stdout)
    
    schemaPayload.forEach((item) => {
        var folderName = checkForControlId(item)
        console.log(folderName)
    try {fs.mkdirSync(folderName)} catch (error) {
        'exist'
    }
    

    })

}

function checkForControlId (id) {
    //maximum relativenes to find correct index of Azure ResourceID
    var checkId = id.split('/')
    var position = checkId.indexOf('providers')
    //var position = id.indexOf('providers')
    var EASTMap =`${checkId[position]}/${checkId[position+1]}/`
    var folder =path.resolve('md/ms/Azure',EASTMap)
    console.log(EASTMap)
    return folder
     
}
