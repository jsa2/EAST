const fs = require('fs')

function reprocess(data) {
    console.log(data)
    try {
      let current =  JSON.parse(fs.readFileSync('content.json').toString())
      //before delta
      console.log(current.length)
      data.forEach(delta => {
         current = current.filter(cur => cur?.resource !== delta?.resource && cur?.controlId !== delta?.controlId)
        })
    //after removal
    data.forEach(delta => current.push(delta))
    
    
 //after removal
      console.log(current.length)
      return current
    } catch (error) {
        console.log('no previous file, or unable to parse content.json')
    }

}


module.exports={reprocess}