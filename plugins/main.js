const { runner, wexc } = require('./pluginRunner')
const schemaBuilder =require('./nodeSrc/schemaBuilder')
const { batchThrottled } = require('./nodeSrc/batch')
const fs = require('fs')
const {argv} = require('yargs')
const beautify = require('js-beautify').js
const {resourceGraphGovernanceData} = require('./nodeSrc/asb')
const { listAllResources } = require('./nodeSrc/nativescope')
const { filterProviders } = require('./nodeSrc/filterExistingProviders')
const { getMFAStatus } = require('./nodeSrc/aadHelpers')
const { decode } = require('jsonwebtoken')

const chalk = require('chalk')
const { getAADIamToken } = require('./nodeSrc/getToken')
process.env.checkMFA = true



main()

// What is EAST? Read EAST.MD# sdss

async function main () {

  try {await wexc('az account get-access-token --resource=74658136-14ec-4630-ad9b-26e160ff0fc6 --query accessToken --output json')} catch(error) {
     var msg = `run 'account clear' and then 'az login' - application is unable to read token cache.\r\nthis is typical error in first run of cloudShell as no cache is created, stack: ${error.message}`
     console.log(chalk.yellow(msg))
     return {msg}
  }


console.log(chalk.yellow('pre-requisites ok'))

 var tkn =decode(await getAADIamToken())

 if (!tkn) {
   console.log(chalk.yellow('failed to get token'))
   return;
 }

  await getMFAStatus(tkn.oid).catch((error) => {
   process.env.checkMFA = false
    console.log( 'Setting MFA evaluation to false, this requires that user has any AAD role, when AAD portal access is restricted \r\n You can grant low privileged role to user, such as "directory reader" which does not effectively raise the privs of the user')
  })

  console.log(process.env.checkMFA)

if (argv.scope && !argv.nativescope) {
   console.log(argv.scope)
   var res= await runner(argv.scope)
}

if (argv.nativescope) {
   var res = await listAllResources()
   res.map(item => item.id = item.id.toLowerCase())
   res = filterProviders(res)
   
   if (argv.namespace) {
      //var res = res.filter((item) => item.id.match(argv.namespace.toLowerCase()))
     // fs.writeFileSync('res.json', JSON.stringify(res))
      res = argv.namespace.split(',').map(e => {
         return res.filter(s => s.id.toLowerCase().match(e.toLowerCase()))
      }).flat()
      console.log(res)
   }

   if (argv.notIncludes) {
      var res = res.filter((item) => !item.id.match(argv.notIncludes.toLowerCase()))
   }
     //Push authorizations 
     //res = []
     if (argv.roleAssignments == "true") {
 /*      JSON.parse(process.env.subs).forEach((sub => {
         console.log(sub)})) */
      JSON.parse(process.env.subs).forEach((sub) => res.push({id:`/providers/microsoft.authorization/${sub.id}`}))
     }
   
   
}


  

  //Splice for smaller sample
  if (argv.splice) {
     st = argv.splice.split(',')
     var res = res.splice(Number(st[0]),Number(st[1]))
   }


   
if (argv.checkAad == "true") {
   //
   res.push({"id":"/tenant/providers/microsoft.azureactivedirectory/AADDefaultSettings/Review"})
   
}

if (argv.helperTexts) {
   res.push({"id":"/tenant/providers/microsoft.general/topics/Review"})
}

   res.map((item) => {
      item.runContext= {
         fn: runner,
         schema:schemaBuilder,
         mode:`mode=native`,
         resourceId:item.id
      }
   })

 
   var wa = await batchThrottled(argv.batch,res)
   
   wa = wa.flat()
   //makeSingleArray(wa,r)


   if (argv.asb == "true") {
      var ASB = await resourceGraphGovernanceData(JSON.parse(process.env.subs))
      ASB.forEach((item) => wa.push(item))
   }


   console.log('batch size was', res.length, ': - batch is completed')
   
   wa = wa.filter((item) => item.isHealthy !== "notApplicable")

   if (argv.composites) {
      console.log(chalk.yellow('checking for composites'))
         try {
         
            let composites = fs.readdirSync('./composites').filter(c => !c.toLowerCase().match('disabled'))
            for await (comp of composites) {
      
               let compRes =await require(`../composites/${comp}`)(wa) 
               if (Array.isArray(compRes) && compRes.length > 0) {
                  
                 compRes.map(s => wa.push(s))
               } else if (compRes?.controlId) {
                  wa.push(compRes)
               }
      
            }
      
         } catch (error) {
            console.log('processing composites failed')
         }
         
      }
      
 
   
   
   //fs.writeFileSync('content.json',beautify(r,{ indent_size: 2, space_in_empty_paren: true }))

   fs.writeFileSync('content.json', beautify(JSON.stringify(wa),{ indent_size: 2, space_in_empty_paren: true }))
  

}



