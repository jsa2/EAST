const { responseSchema } = require("../plugins/nodeSrc/functionResponseSchema")
const { returnObjectInit } = require("../plugins/nodeSrc/returnObjectInit")

//test(require('../content.json'))


async function test (src) {

    let processed = src.filter(s => s.controlId == "Subscription_amdcAlerts" )
    var uniqResId = new Set(src.map(s => s.id))
    
    let alerts = JSON.stringify(processed).toLowerCase()
    var mts = []
        for (res of uniqResId) {
        //console.log(res)
          var errorProp
        
        processed.map(s => {
          s.metadata.results.map(m => {
            try {
              let metadata = JSON.parse(m.metadata)?.properties?.ResourceIdentifiers
              errorProp = m
              if (JSON.stringify(metadata).toLowerCase().match(res)) {
                let rt = {
                    name:res.split('/').pop(),
                    id:res
                }
                 let item=  new returnObjectInit(rt,__filename.split('/').pop())
                 item.isHealthy=false
                 delete m.metadata
                 item.metadata = m
               
                let s = new responseSchema(item, {Category:"Protection",Description:"Review MDC alerts on this resource"})
                mts.push(s)
              }
            } catch (error) {
              console.log(m.metadata)
              console.log(errorProp)
            }
                       
          })
        })
    }
    return mts
    
}

module.exports = async function (src) { 
    
  let processed = src.filter(s => s.controlId == "Subscription_amdcAlerts" )
  var uniqResId = new Set(src.map(s => s.id))
  
  let alerts = JSON.stringify(processed).toLowerCase()
  var mts = []
      for (res of uniqResId) {
      //console.log(res)
        var errorProp
      
      processed.map(s => {
        s.metadata.results.map(m => {
          try {
            let metadata = JSON.parse(m.metadata)?.properties?.ResourceIdentifiers
            errorProp = m
            if (JSON.stringify(metadata).toLowerCase().match(res)) {
              let rt = {
                  name:res.split('/').pop(),
                  id:res
              }
               let item=  new returnObjectInit(rt,__filename.split('/').pop())
               item.isHealthy=false
               delete m.metadata
               item.metadata = m
             
              let s = new responseSchema(item, {Category:"Protection",Description:"Review MDC alerts on this resource"})
              mts.push(s)
            }
          } catch (error) {
           /*  console.log(m.metadata)
            console.log(errorProp) */
          }
                     
        })
      })
  }
  return mts

}