
const { runner } = require("../pluginRunner");
const fs = require('fs');
const { responseSchema } = require("./functionResponseSchema");
// declare existing ahead of time, so if it's required later it will be in memory
var existing

async function getAzPolicyDefinition (script) {

if (existing) {
    return existing.result
}

    try {
         existing = require('../../policy/policyDefinition.json')   

    } catch(error) {
        console.log('no existing policy')
    }

    if (existing?.script == script) {

         var cache = {
            script,
            result:existing.result
        }
        
        fs.writeFileSync('./policy/policyDefinition.json',JSON.stringify(cache))
        return existing.result
    } else {

    var result =  await runner(script)

    var cache = {
        script,result
    }

    fs.writeFileSync('./policy/policyDefinition.json',JSON.stringify(cache))

    return result

    }

    
    
 

}   

async function getAzPolicy (script, append) {
    var d = await getAzPolicyDefinition()
    var result =  await runner(script)

    var results = []
    if (typeof(append)== "object") {
        results = append
    }
   
    result.map((item) => {
        var name = item.policyDefinitionId.split('/').pop()

        var definitionMapping = d.find((ref) => (ref.name == name))

        console.log(item.description)
      
        if ( !item.isHealthy.toLowerCase() == "noncompliant") {item.isHealthy=false} else {
            item.isHealthy=true
        }

       results.push (new responseSchema({
            id:item.resourceId,
            isHealthy:item.isHealthy,
            name: `AzPol_${definitionMapping.displayName.replace(new RegExp(' ','g'),'_')}`,
            fileName: `AZ-Policy:${item.id}.js`,
            metadata:{}
        },{Description:definitionMapping.description}))
       // return response

    }) 

    //reuse functionResponseSchema, in functions the controlId is derived from filename
   // console.log(results)
    return results
    
}

module.exports={getAzPolicyDefinition, getAzPolicy}

//
