
const fs = require('fs')
const path = require('path')
const {argv} = require('yargs')

createTempl()

async function createTempl() {

    try {
       
var emptyFunction = `


const { AzNodeRest } = require("../../../plugins/nodeSrc/east")
const { getProviderApiVersion } = require("../../../plugins/nodeSrc/getProvider")
const { returnObjectInit } = require("../../../plugins/nodeSrc/returnObjectInit")

//AzNodeRest
module.exports = async function (item) {

let returnObject = new returnObjectInit(item,__filename.split('/').pop())

if (item?.id.match('databases')) {
    returnObject.metadata = item?.properties
    returnObject.isHealthy="notApplicable"
    return returnObject
}

var {apiversion} = getProviderApiVersion(item.id)

item = await AzNodeRest(\`\${item.id}/firewallRules/\`,apiversion)

var is = item?.value.filter((rules) => rules.name == "AllowAllWindowsAzureIps")

if ( is.length > 0){
    returnObject.isHealthy=false
} 

returnObject.metadata = {item}
//console.log(stashOrig)

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
