const fs = require('fs')
const path = require('path')

function filterProviders (res) {

var providersPath = path.resolve(`providers`)
let listF =fs.readdirSync(`${providersPath}`).filter((item) => !item.match('disabled_'))

let supported =res.filter(item => {
    let provider =item.id.split('providers')[1].split('/')[1]
    if (listF.includes(provider)) {
        return item
    }
    else {
        console.log('skipping', provider)
    }
})
    
return supported





}

module.exports={filterProviders}
