var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"
    
    it.metadata.results.map(s => {
   
      
      details+="\r\n"
      details+="\r\n"
      details += `###### ${s.refInfo}`
      details+="\r\n"
      details+="\r\n"
      details+= `Count of principals in role ${s.value.length}`
      details+="\r\n"
      var sd = beautify(JSON.stringify(s.value),{ indent_size: 2, space_in_empty_paren: true })
      details+="\r\n"
      details+=`\`\`\`json \r\n ${sd} \r\n \`\`\`\r\n`

    })

   

    return details
    
}


