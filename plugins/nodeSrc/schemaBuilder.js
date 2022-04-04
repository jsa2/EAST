

const fs = require('fs')
var path = require('path')
const {responseSchema} = require('../nodeSrc/functionResponseSchema')
const { checkSubProviderResource } = require('./subProviderCheck')

//console.log(listF)#
// Async constructor example - this example helped greatly https://stackoverflow.com/questions/43431550/async-await-class-constructor
var i = 0
module.exports= class AsyncConstructor {
    constructor(data) {

        return (async () => {
            data.id = data.id.toLowerCase()
            data.type = data.type.toLowerCase()
            console.log(data.name, 'checking')
            //var provider = data.type.split('/')[0]
            let provider = checkSubProviderResource(data)
            var providersPath = path.resolve(`providers/${provider}`)
            let listF =fs.readdirSync(`${providersPath}/functions`).filter((item) => !item.match('disabled_'))
            this.name = data.name
            const controls = []
            for await (const sd of listF) {
            
                console.log('total requests: ', i++, 'running', sd, 'for', data.name)
                var fnName = sd.split('.js')[0]
                var controlDefinition = await require(`${providersPath}/controls/${fnName}`)
                var functionResult = await require(`${providersPath}/functions/${fnName}`)(data)
               
                controls.push(new responseSchema(functionResult, controlDefinition))
            }
            
            this.controls = controls
            //console.log(data.name, ' comple')
            
            return this.controls

         //return this
        })();
    }
}






