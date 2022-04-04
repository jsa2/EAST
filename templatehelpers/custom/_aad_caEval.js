var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"
    
    Object.keys(it.metadata).map(s => {
   
      
      details+="\r\n"
      details+="\r\n"
      details += `**Policy ${s}**`
      details+="\r\n"
      details+="\r\n"
      let sf = JSON.parse(it.metadata[s]?.details)
      var sd = beautify(JSON.stringify(sf),{ indent_size: 2, space_in_empty_paren: true })
      details+="\r\n"
      details+=`\`\`\`json \r\n ${sd} \r\n \`\`\`\r\n`

    })

   

    return details
    
}


