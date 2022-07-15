
const { argv } = require('yargs')
const { resourceGraphGovernanceData } = require('../plugins/nodeSrc/asb')
const { resourceGraphGovernanceData2 } = require('../plugins/nodeSrc/asb2')
const { runner } = require('../plugins/pluginRunner')
const chalk = require('chalk')
const {exec} =require('child_process')
const wexc = require('util').promisify(exec)


main()

async function main () {

   /*  try {
        await wexc(`pandoc -v`)} catch(error) {
        console.log(chalk.red('Missing Pandoc, aborting'))
        return;
          } */
  //

var fs = require('fs')
const { getToken } = require('../plugins/nodeSrc/getToken')
const { newSetA } = require('../plugins/nodeSrc/grouping3')
const { group, count } = require('console')
var beautify = require('js-beautify').js
var gvs = await runner('az account list --output json')


var sd = require('../content.json').filter(item => item.isHealthy !== 'not applicable, provider not supported')

sd.map(item => item.controlId = `EAST_${item.controlId}`)

var gvId = gvs.map((sub) =>sub.id)

// Uses securityAssessments instead of ASB controls
var asb


if (argv.asb || argv.policy) {

  if (argv.policy) {

    asb = await resourceGraphGovernanceData2(gvId)
  
    asb.map((item) => {
      item.subscriptionName = gvs.find((sub) => sub.id == item.subscriptionId)?.name
    })
    
  } 
  if (argv.asb) {
    asb = await resourceGraphGovernanceData(gvId)
    asb.map((item) => {
      item.subscriptionName = gvs.find((sub) => sub.id == item.subscriptionId)?.name
    })
    
  }

  if (argv.namespace) {
    //var res = res.filter((item) => item.id.match(argv.namespace.toLowerCase()))
   // fs.writeFileSync('res.json', JSON.stringify(res))
    asb = argv.namespace.split(',').map(e => {
       return asb.filter(s => s.id.toLowerCase().match(e.toLowerCase()))
    }).flat()
    console.log(res)
  }
  
  if (argv.notIncludes) {
    let noList = argv.notIncludes.split(',')
    asb = asb.filter( s => !noList.find( l => s.id.toLowerCase().match(l.toLowerCase())) ) 
  }

  asb.map(s => sd.push(s))

}



//ASB handled

if (argv.azsk) {
  require('../azskdata.json').map(item => {

    var metadata = item
    
    if (item?.state == undefined) {
      item.state="manual"
    }
  
    if (item.state.toLowerCase() == "unhealthy") {
      var isHealthy = "false"
    }
  
    if (item.state.toLowerCase() == "healthy") {
      var isHealthy = "true"
    }
  
    
    if (item.state.toLowerCase() == "manual") {
      var isHealthy = "manual"
    }

    if (item.state.toLowerCase() == "review") {
      var isHealthy = "review"
    }
  
     sd.push( {
      controlId:`AZSK_${item.controlId}`,
      id:item.resourceId,
      metadata,
      Description:item.description,
      isHealthy,
      name:item.resourceName
  
    })
  
  })
  
}


//AZSK 
var topics = sd.filter(item => item.name == 'topics')
var sd = sd.filter(item => !item.isHealthy.toString().match('pplicable')&& item.name !== 'topics')
sd.map(item => {

  try {item.isHealthy = item.isHealthy.toString()} catch(error) {
    console.log(error)
  }
  

  if (item.isHealthy.toLowerCase() == "healthy") {
    item.isHealthy = "true"
  }

  if (item.isHealthy.toLowerCase() == "unhealthy") {
    item.isHealthy = "false"
  }

  if (item.isHealthy.toLowerCase() == "healthy-withExceptions") {
    item.isHealthy = "manual"
  }

  try {

    if (item?.id.match('providers')) {
      item.provider = item.id.split('providers')[1].split('/')[1].toLowerCase().replace('.','_')
     } else {
      console.log(item)
      item.provider = "general"
     }

  }catch(error) {
    console.log()
  }
 
})


var countHealth = newSetA(sd,['isHealthy'])
var failed = countHealth.filter(g => g.group == "false")[0]?.items.length
var healthy = countHealth.filter(g => g.group == "true")[0]?.items.length
//
var top = "**Scan** \r\n \r\n"
top +="Scan items|failed|success|manual\r\n-|-|-|-\r\n"
top+=`${sd.length}|${failed}|${healthy}|${sd.length-(failed+healthy)}`
top += "\r\n"

// create frameworks
sd.map(fw => {
  fw.framework = fw.controlId.split('_')[0]
})

var s = newSetA(sd,['provider','controlId','isHealthy'])


var reaD = "name|failed|success|manual \r\n -|-|-|- \r\n"
var i = 0
//var columns = "name|failed|success|manual \r\n -|-|-|- \r\n"
var rows = ""
//rows+=top
var details =`# Explanations and metadata \r\n`
details +="\r\n"
details +="\r\n"

var discoveryNotes = "# Discovery Notes"
discoveryNotes +="\r\n"
discoveryNotes +="\r\n"
details += "\r\n"

topics.map(tp => {
  details += "\r\n"
  details += "\r\n"
  discoveryNotes +="\r\n"
  discoveryNotes += `## ${tp.controlId} \r\n`
  discoveryNotes +="\r\n"
  discoveryNotes +="\r\n"
  discoveryNotes += ` ${tp.Description} `
  discoveryNotes +="\r\n"
  discoveryNotes +="\r\n"
  discoveryNotes += "\r\n --- \r\n "
  discoveryNotes +="\r\n"
  discoveryNotes +="\r\n"
})

s.sort((a,b) => {
  //console.log(a)
  if (a.group.toLowerCase() < b.group.toLowerCase()) {
    return -1;
  } else {
    return 0
  }
})
s.map((provider,index) => {

  details+=`## ${provider.group} \r\n`
  details +="\r\n"
  details +="\r\n"
  
  rows+=`## ${provider.group} \r\n`
  rows+=reaD
  var results = provider.items[0]

  results.map(prov => {
    prov.framework = prov.group.split('_')[0]
  })

  var newResults = newSetA(results,['framework'])

  newResults.sort((a,b) => {
    //console.log(a)
    if (a.group.toLowerCase() > b.group.toLowerCase()) {
      return -1;
    } else {
      return 0
    }
  })


  newResults.map(results => {

    console.log(results)

    details += "\r\n"
    details += "\r\n"
    details += `### ${results.group}`
    details += "\r\n"
    details += "\r\n"
    
// first sort

results.items.sort((a,b) => {
var sa = a.items[0][0].group.toLowerCase()
var sb = b.items[0][0].group.toLowerCase()
  if ( sa < sb) {
    return -1;
  } else {
    return 0
  }

})
    
    results.items.map((control) => {

      var controLink = `${control.group.toLowerCase()}`
      var controlText = control.group.replace(`${control.group.split('_')[0]}_`,"")
      details += "\r\n"
      details += "\r\n"
      details += "\r\n"
      details += `#### ${controlText} <span id="${controLink}"> </span>`
      details += "\r\n"
      details += "\r\n"
      details += `**Descriptions**`
      details += "\r\n"
      details += "\r\n"
      details += `${control.items[0][0].items[0].Description}`
      details += "\r\n"
      details += "\r\n"
  
  
      if(control.items[0][0].items[0].controlId.match('ASB')) {
        var s=JSON.parse(control.items[0][0].items[0].metadata.asb)
        details+="\r\n"
        details += "\r\n"
        details +=`**Remediation**`
        details += "\r\n"
        details += "\r\n"
        details += s?.remediationSteps || s?.metadata?.remediationDescription || JSON.stringify(s.metadata)
        details += "\r\n"
        details+="\r\n"
        details += "\r\n"
      }
  
      if(control.items[0][0].items[0].controlId.match('AZSK')) {
  
        details+="\r\n"
        details += "\r\n"
        details +=`**Remediation**`
        details += "\r\n"
        details += "\r\n"
        details += control.items[0][0].items[0].metadata.remediationSteps
        details += "\r\n"
        details+="\r\n"
        details += "\r\n"
      }
  
  
      details += `**Metadata**`
      details += "\r\n"
      details += "\r\n"
      
      rows += `[${control.group}](#${controLink})| `
  
      if (control.group.match('list')) {
        var link = (control.group)
      }
  
      console.log('count', i++)
  
      control.items.forEach((status) => {
  
        console.log(status)
  
        status.sort((a,b) => {
          //console.log(a)
          if (a.group.toLowerCase() < b.group.toLowerCase()) {
            return -1;
          } else if (a.group.toLowerCase){
            return 0
          }
        })

        status.sort((a,b) => {
          //console.log(a)
          if (a.group.toLowerCase() == "true" && b.group !== "false")  {
            return -1;
          } 
        })
  


        status.forEach((st) => {
         // var previous 
          //console.log(control.group)
         
          
          if (control.group.match('list')) {
            var link = (control.group)
          }
          
          

          

          details+="\r\n"
          details+="\r\n"
          var lnk=`healthy_${st.group}_${control.group}`.toLowerCase()
          //details+=`##### ${lnk}`
          var state = st.group
          if (st.group == "false") {
            var state = "❌"
          } 
          if (st.group == "manual") {
            var state = "📑"
          }
          if (st.group == "true") {
            var state = "✔️"
          }

          if (st.group == "review") {
            var state = "🔍"
          }

         // console.log(`<h4> ${st.group}_${control.group} <span id="${lnk}"> </span> <h4>`)
          details+=`##### ${state} - ${st.items.length} <span id="${lnk}"> </span>`
          details+="\r\n"
          details+="\r\n"
          //

          if (control.group.match('LogicApps_Connections') && st.group == "review") {
            console.log()
          }
       
          if (st.group == 'false') {
            rows += `❌[${st.items.length}](#${lnk})`
          }

          if (st.group == "true") {
            rows += `|✅[${st.items.length}](#${lnk})`
          }

          if (st.group == "manual" || st.group == "review") {
            if (previous == 'true' && previousControl == control.group) {
              rows += `|${state}[${st.items.length}](#${lnk})`
            } else {
              rows += `||${state}[${st.items.length}](#${lnk})`
            }
              
          }
          previousControl = control.group
          previous = st.group
          

        /*   if (st.group == "review") {
            rows += `||🔍[${st.items.length}](#${lnk})`
          } */
  
          
          if (st.items[0].controlId.match('ASB_')) {
            st.items.forEach(it => {
              
              let recommendationLink 
              try {
                let mtd = JSON.parse(it.metadata?.asb)?.azurePortalRecommendationLink || JSON.parse(it.metadata?.asb)?.links?.azurePortal
                if (mtd) {
                  recommendationLink = `[link to recommendation](https://${mtd})`
                }

              } catch (error) {
                //no recommendation link to be parsed
              }
              let ctrlID = JSON.parse(it.metadata?.asb)?.complianceControlId
              details+=`\r\n - [${it.id.split('/').pop()}](https://portal.azure.com/#@/resource${it.id}) - ${recommendationLink || "no recommendation link"} - complianceControlId: ${ctrlID || "not available in --policy switch"}`

          })
          } 

          if (st.items[0].controlId.match('AZSK_')) {  
            st.items.forEach(it => details+=`\r\n - [${it.name}](https://portal.azure.com/#@/resource${it.id}) \r\n`)
          }

          if (st.items[0].controlId.match('EAST_Subscriptions')) {
            st.items.forEach(it => details+=`\r\n - [${it.name}](https://portal.azure.com/#@/resource${it.id.split('/providers/microsoft.authorization')[0]}) - [metadata](#metadata_${it.name}_${control.group})\r\n`.toLowerCase() )
            console.log()
          } else if (st.items[0].controlId.match('EAST') && !st.items[0].name.toLowerCase().match('aaddefaultsettings') ) { 
            st.items.forEach(it => details+=`\r\n - [${it.name}](https://portal.azure.com/#@/resource${it.id}) - [metadata](#metadata_${it.name}_${control.group})\r\n`.toLowerCase() )
          }  
          
          if(st.items[0].name.toLowerCase().match('aaddefaultsettings')) {
            st.items.forEach(it => details+=`\r\n - [${it.name}](https://aad.portal.azure.com) - [metadata](#metadata_${it.name}_${control.group})\r\n`.toLowerCase() )
          }
      
          details+="\r\n"
          details+="\r\n"
          details+="\r\n"
          details+="\r\n"
          details+=`**jump back to [${st.items[0].provider}](#${st.items[0].provider})**`
          details+="\r\n"
          details+="\r\n"
  
          st.items.forEach((it) => {
            details+="\r\n"
            details+="\r\n"

          var processed 
          // Check if custom metadata is to be returned
          try {
            var controlD = st.items[0].controlId.replace(st.items[0].controlId.split('_')[0],'')
            processed =require(`./custom/${controlD}`)(it,control)
            details+=processed
          }  catch (error) {
          //  console.log('no custom control for', st.items[0].controlId)
          }
           
          if(it.controlId.match('EAST_') && !processed) {
            var lnk=`metadata_${it.name}_${control.group}`.toLowerCase()
            details+=`<p> ${it.name}_${control.group} <span id="${lnk}"> </span> </p>`
            details+=``
            details+="\r\n"
            details+="\r\n"
            var sd = beautify(JSON.stringify(it.metadata),{ indent_size: 2, space_in_empty_paren: true })
            details+="\r\n"
            details+=`\`\`\`json \r\n ${sd} \r\n \`\`\`\r\n`
            
          } 
          

          
          })
  
        })
  
      })
  
  
      rows += "\r\n"
      console.log()
  
    })

  })

 


})



var additional ="\r\n# Results \r\n"
var data = (discoveryNotes + additional)+(top+rows+details)

fs.writeFileSync('rules.md',data)
console.log('done')

var fn = "fullReport2"
fs.writeFileSync(`${fn}.md`,data)
console.log('done')
//update
if (argv.doc) {
  console.log(chalk.green('to export to pandoc run:'))

  console.log(chalk.yellow`pandoc -s ${fn}.md -f markdown -t docx --reference-doc=pandoc-template.docx -o ${fn}.docx`)
  

}

if (argv.nx) {

  try {

    console.log(`pandoc -s ${fn}.md -f markdown -t docx --reference-doc=pandoc-template.docx -o /mnt/c/temp/${fn}.docx`)
    await wexc(`pandoc -s ${fn}.md -f markdown -t docx --reference-doc=pandoc-template.docx -o /mnt/c/temp/${fn}.docx`)
    await wexc(`cp Azure-Assessment-Template.docx /mnt/c/temp/Azure-Assessment-Template.docx`)
  } catch (error) {
    console.log('no standard template defined')
  }
 

}


}