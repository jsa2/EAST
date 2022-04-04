const {exec} =require('child_process')
const { AzNodeRest } = require('./nodeSrc/east')
const wexc = require('util').promisify(exec)
var path = require('path')
const { erroResponseSchema } = require('./nodeSrc/functionResponseSchema')
const bfr = {maxBuffer: 1024 * 1024}

const { checkSubProvider } = require('./nodeSrc/subProviderCheck')

// Control with NodeSchema

    async function runner (script, NodeSchema, native) {
        try {

            if (native) {
                let provider = native.split('providers')[1].split('/')[1]
                let apiversion = checkSubProvider(native)
                console.log(apiversion)
                //If provider is AAD there is no need to get ITEMID, proceed straight to functions and controls
                if (require('../providers/ignore.json').includes(provider)) {
                    const schemaPayload ={
                        id:native.split('providers')[1].split('/')[2],
                        name:native.split('providers')[1].split('/')[2],
                        type:provider
                    }
                    return await new NodeSchema(schemaPayload)
                } else {
                    var schemaPayload = await AzNodeRest(native,apiversion)
                }
                
                let result = await new NodeSchema(schemaPayload)
                //console.log(result.controls)
                return result
            }
            // Handle uncatched errors
        } catch (error) {
                return new erroResponseSchema(native,error)
        }
      
        if (NodeSchema && !script.match('mode=native') ) {

            try { 
                var {stdout} = await wexc(script, bfr) 
                // Check if output is valid 
                schemaPayload = JSON.parse(stdout)
                var result = await new NodeSchema(schemaPayload)
                //console.log(result)
                return result
            }
            catch(error) {
                console.log(error)
                return `Failed to process ${script}`
            }

        } else {

            try { 
                var {stdout,stderr} = await wexc(script, bfr) 
                results = JSON.parse(stdout)
                //console.log(results)
                return results
            }
            catch(error) {
                console.log(error)
                return `Failed to process ${script}, due to ${JSON.stringify(error)}`
            }

        }

        
}

module.exports={runner,wexc}


 