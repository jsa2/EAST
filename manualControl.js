
const fs = require('fs')
const path = require('path')
const {argv} = require('yargs')

createTempl()

async function createTempl() {

    try {
       
var emptyFunction = `

const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {
let returnObject = new returnObjectInit(item,__filename.split('/').pop())
//console.log(stashOrig)
returnObject.metadata={} 
returnObject.isHealthy="manual"
return returnObject

}


`



var emptyControl =`{
"ControlId": "${argv.name}",
"Category": "EXAMPLE: Authentication strength, Attack surface reduction",
"Description": "EXAMPLE: Ensure The Service calls downstream resources with managed identity"
}`

        var root = 'providers'

        console.log(argv)

        var dest = path.join(root, argv.provider)

        //console.log(dest)

        try {
            fs.mkdirSync(dest)
            fs.writeFileSync(`${path.join(`${dest}`,'.apiVersion.json')}`,`{"apiversion":"2021-04-01-preview"}`)
           } catch (error) {
            console.log('folder exists','trying to create subfolders if needed')
           }

           try {
        
            fs.mkdirSync(`${path.join(`${dest}/controls`)}`)
            fs.mkdirSync(`${path.join(`${dest}/functions`)}`)
           } catch (error) {
            console.log('folder exists','trying to create controls if needed')
          
           }

           try {  fs.writeFileSync(`${path.join(`${dest}/controls`,argv.name)}.json`,emptyControl)
           fs.writeFileSync(`${path.join(`${dest}/functions`,argv.name)}.js`,emptyFunction)} catch (error) {
            console.log('folder exists','trying to create controls if needed')
          
           }


    } catch (error) {
        console.log(error)
        console.log('please provide name, example node controlTemplate nameIs=IdentityS')
    }


}
