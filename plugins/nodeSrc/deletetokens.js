const fs = require('fs')

function clearEASTTokenCache() {

    fs.readdirSync('./plugins/session').filter(s => s !== "dontremove.json").map(d => fs.unlinkSync(`./plugins/session/${d}`))
    return;
}

module.exports= {clearEASTTokenCache}