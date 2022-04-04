var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"
    it.metadata.assessments.sort((a,b) => {
        //console.log(a)
        if (a.status.toLowerCase() > b.status.toLowerCase()) {
          return -1;
        } else {
          return 0
        }
      })

      it.metadata.assessments.forEach(s => {

        details+="\r\n"
        details+="\r\n"
        details+= `**Status: ${s.status} DB: ${s.database} : ${s.id}**`
        details+="\r\n"
        details+="\r\n"
        details+= `Description: ${s.description} \r\n Impact: ${s.impact}`
        details+="\r\n"
        details+="\r\n"

      })

   

    return details
    
}


