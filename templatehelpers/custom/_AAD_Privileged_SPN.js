var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"
    details+="\r\n"
    details+="\r\n"
  
      it.metadata.forEach(s => {
        details+="\r\n"
        details+= ` \`\`\`${s.replace('#microsoft.graph.servicePrincipal','SPN')} \`\`\` `
        details+="\r\n"

      })

   

    return details
    
}


