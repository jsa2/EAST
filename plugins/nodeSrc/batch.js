
var waitT = require('util').promisify(setTimeout)

async function batchThrottled (burstCount, arrayOfObjects) {

var promArra = []
var returnObject = []
let i = 0

    for await ({runContext} of arrayOfObjects) {
        i++
       // console.log(i)

        var {fn, schema, mode, resourceId} = runContext
        
        if (i % burstCount == 0) {
            await waitT(1000)
        }
        
        promArra.push(
            fn(mode,schema, resourceId).catch((error) => {
                console.log(error)
                //returnObject.push({error:resourceId})
            }).then((data) => {
                if (data) {
                    returnObject.push(data)
                }
                
            })
        )

    }

await Promise.all(promArra)
return returnObject

}

async function batchThrottledSimple (burstCount, arrayOfObjects) {

    var promArra = []
    var returnObject = []
    let i = 0
    
        for await ({runContext} of arrayOfObjects) {
            i++
           // console.log(i)
    
            var {fn,opts} = runContext
            
            if (i % burstCount == 0) {
                await waitT(1000)
                console.log('await done for batchThrottleSimple')
            }
            
            promArra.push(
                fn(opts).catch((error) => {
                    console.log('no match in graph', opts.url)
                    //returnObject.push({error:resourceId})
                }).then((data) => {
                    if (data) {
                        returnObject.push(data)
                    }
                    
                })
            )
    
        }
    
    await Promise.all(promArra)
    return returnObject
    
    }



module.exports={batchThrottled,batchThrottledSimple}