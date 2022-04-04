
/* 
var items = require('../../content.json') */
//var item = {}
function makeSingleArray (item,arr) { 
    if (Array.isArray(item)) {
        console.log(item.length)
        item.forEach((item) => {
            makeSingleArray(item,arr)
        })
    } else {
        arr.push(item)
    } 

}
/* var arr =[]
 makeSingleArray(items,arr)
 //console.log(arr)

  */

 module.exports={makeSingleArray}