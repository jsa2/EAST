var beautify = require('js-beautify').js

module.exports =  function (it,control) {
let details = ''
var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
details+="\r\n"
details+="\r\n"

it.metadata.list.sort((a,b) => {
    if (a.svc.match('"safeCredential":false') ) {
        return -1;
    }
})

it.metadata.list.map(s => {
let ps = JSON.parse(s.svc)
var lnk1 = ps.name.toLowerCase()
details+="\r\n"
details+="\r\n"
details+=`<p> ${ps.name} <span id="${lnk1}"> </span> </p>`
details+="\r\n"
details+="\r\n"
var sd = beautify(JSON.stringify(ps),{ indent_size: 2, space_in_empty_paren: true })
details+="\r\n"
details+=`\`\`\`json \r\n ${sd} \r\n \`\`\`\r\n`



})

   

    return details
    
}


