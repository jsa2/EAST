
/* 
var src = require('./old.json')

orderAllKeysOnAlphaBet(src) */

function orderAllKeysOnAlphaBet(data) {

    if (Array.isArray(data)) {

        if (typeof (data[0]) === "object" && data[0] !== null) {
            // on the first step the resourceId is more important, thus the first key is tried
            let sortBy 
            try {
                sortBy = Object.keys(data[0])?.find(s => s=="id") 
            } catch(error) {
                console.log()
            }

     /*        console.log(sortBy, data[0]) */

            if (sortBy) {
                data.sort( (a,b) => {

                    if  ( a[sortBy] < b[sortBy] ) {
                        return -1;
                      } else {
                        return 0
                      }
    
                })
            } else {

                data.sort( (a,b) => {

                    if  ( JSON.stringify(a) < JSON.stringify(b)) {
                        return -1;
                      } else {
                        return 0
                      }
    
                })

            }
           
        }

        if (typeof (data[0]) === "string") {
           // console.log(data[0])
            data.sort( (a,b) => {
                if (a < b) {
                    return -1;
                } else {
                    return 0
                }
            })
        }

        if (data[0]?.role == "Global Administrator") {
           // console.log()
        }

        data.forEach( s => orderAllKeysOnAlphaBet(s))

}

try {
    if (typeof (data) === "object" && data !== null){
        //console.log(data)
        let tA = Object.keys(data)

        if (tA?.length > 0) {
           // console.log(tA)
            Object.keys(data).forEach(key => {
                orderAllKeysOnAlphaBet(data[key])
            })
        }
        

    }
} catch (error) {

   console.log(error)
}
    


    // this handles all objects
    

  

}

/* console.log(src)
 */

module.exports = { orderAllKeysOnAlphaBet }