const { newSetA } = require('../../plugins/nodeSrc/grouping3')

var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"

    if (it.metadata.length == 0) {
      details+="\r\n"
      details+="\r\n"
      details+="[No Results]"
      details+="\r\n"
      details+="\r\n"

    } else {
      let gr = newSetA(it.metadata, ['policyDefinitionReferenceId'])

      gr.sort((a,b) => {
        //console.log(a)
        if (a.items[0].components.length > b.items[0].components.length ) {
          return -1;
        } else {
          return 0
        }
      })

      gr.map(it => {
        let state = "✔️"
        if (JSON.stringify(it.items[0].components).toLowerCase().match('noncompliant')) {
          state = "❌"
        }

        details += `###### ${state} ${it.items[0].displayName}`
        details += "\r\n"
        details += "\r\n"
        details += "\r\n"
        details += `${it.items[0].description}`
        details += "\r\n"
        details += "\r\n"
        details += "**Resources**"
        details += "\r\n"
        details += "\r\n"
        details += "\r\n"
            it.items.map(d => d.components.forEach(s => {
              details += "\r\n"
              details += "\r\n"
              details += "\r\n"
              details += ` \`\`\`${s.complianceState} : ${s.id} : ${s.type} \`\`\` `
              details += "\r\n"
              details += "\r\n"
              details += "\r\n"

            }))

      })

     
   
    }
     

    return details
    
}


