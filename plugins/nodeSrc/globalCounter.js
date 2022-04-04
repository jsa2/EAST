

function globalCounter (i) {
    if (i) {
        i++;
        console.log(i)
    } else {
        var i = 0
    }
    
}

module.exports={globalCounter}