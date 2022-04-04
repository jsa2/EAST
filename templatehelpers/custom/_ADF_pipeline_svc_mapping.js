var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"
    
    it.metadata.pipelines.map(pi => {
      pi.LinkdSvcToActivity.map(link => {
        details +=`${link.pipeLine}`
        details+="\r\n"
        details+="\r\n"
        details +=` - [${link.links}](#${link.links})`.toLowerCase()
        details+="\r\n"
        details+="\r\n"

      })
    })

   

    return details
    
}


