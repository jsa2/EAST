const { newSetA } = require('../../plugins/nodeSrc/grouping3')


var beautify = require('js-beautify').js

module.exports =  function (it,control) {
    let details = ''
    var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
    details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
    details+=``
    details+="\r\n"
    details+="\r\n"
    details += `###### ${it.name}`
    let sdd = newSetA(it.metadata.assigments,['RoleName'])
    
   sdd.map(s => {
    
      details+="\r\n"
      details+="\r\n"
      details += `####### ${s.group}`
      details+="\r\n"
      details+="\r\n"
      details+= `Count of principals in role ${s.items.length}`
      details+="\r\n"
      var sd = beautify(JSON.stringify(s.items),{ indent_size: 2, space_in_empty_paren: true })
      details+="\r\n"
      //details+=`\`\`\`json \r\n ${sd} \r\n \`\`\`\r\n`
      details+="\r\n"
      details+="\r\n"
      
      var c = 0

      d =  newSetA(s.items,['principalType'])

      d.forEach(s => {

        details+="\r\n"
        details+="\r\n"
        details += `######## ${s.group}s`
        details+="\r\n"
        details+="\r\n"

        s.items.forEach(ite => {
      
      
          if (ite.mfaResults?.basicAuth?.appliedPol.length == 0 ||ite.mfaResults?.MFAstatus?.appliedPol.length == 0 ) {
            let sd2 = beautify(JSON.stringify(ite.mfaResults),{ indent_size: 2, space_in_empty_paren: true })
            if (c == 0) {
              details += `######### ❌ Security Failures`
              details+="\r\n"
              details+="\r\n"
          
            }
            c++
            details+="\r\n"
            details+=" **Object can bypass MFA or basic Auth policy**"
            details+="\r\n"
            details+=`\`\` ${ite?.friendlyName} - ${ite?.subName} -${ite?.RoleName} \`\`  `
            details+="\r\n"
            details+="\r\n"
            details+=`\`\`\`json \r\n ${sd2} \r\n \`\`\`\r\n`
            details+="\r\n"
            details+="\r\n"
          }  else if (ite?.principalType == "User") {
            details+="\r\n"
            details+="**Object is healthy**"
            details+="\r\n"
            details+=`\`\` ${ite?.friendlyName} - ${ite?.subName} -${ite?.RoleName} \`\`  `
            details+="\r\n"
            details+="\r\n"
   //         details+=`\`\`\`json \r\n ${sd2} \r\n \`\`\`\r\n`
            details+="\r\n"
            details+="\r\n"
          }
  
          if (ite?.creds?.AppRegPasswordCred?.length > 0 && typeof(ite?.creds?.AppRegPasswordCred) === "object" ) {
            let sd3 = beautify(JSON.stringify(ite.creds.AppRegPasswordCred),{ indent_size: 2, space_in_empty_paren: true })
         
            if (c == 0) {
              details += `######### ❌ Security Failures`
              details+="\r\n"
              details+="\r\n"
            }
            c++
            details+="\r\n"
            details+="**Object has weak single-factor credentials  (password/client_secret)**"
            details+="\r\n"
            details+="\r\n"
            details+=`\`\` ${ite?.principalId} -> ${ite?.friendlyName} - ${ite?.subName} -${ite?.RoleName} \`\`  `
            details+="\r\n"
            details+="\r\n"
            details+=`\`\`\`json \r\n ${sd3} \r\n \`\`\`\r\n`
            details+="\r\n"
            details+="\r\n"
          } else if (ite?.principalType == "ServicePrincipal") {
            details+="\r\n"
            details+="**Object is healthy dog**"
            details+="\r\n"
            details+=`\`\` ${ite?.principalId} - ${ite?.subName} -${ite?.RoleName} \`\`  `
            details+="\r\n"
            details+="\r\n"
   //         details+=`\`\`\`json \r\n ${sd2} \r\n \`\`\`\r\n`
            details+="\r\n"
            details+="\r\n"
          }
          
          
        })
      })

     

      details+="\r\n"
      details+="\r\n"

    })

   

    return details
    
}


