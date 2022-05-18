
//const webappSchema = require('./webapp/webappsSchema')

var fs = require('fs')
const {argv, array} = require('yargs')
const { batchThrottled } = require('./batch')
var beautify = require('js-beautify').js
const { runner } = require('../pluginRunner')
const {getToken} = require('./getToken')
var subs = []
var subsNnames =[]



var resa = []
function schema (subscription) {
   if (subscription.length > 0) {
      console.log('got resources for subscription', subscription[0]?.id.split('/')[2])
   }
 
   this.subscription = subscription
   subscription.forEach(element => {
      resa.push(element)
   });
   return this.subscription
}
// What is EAST? Read EAST.MD#

async function listAllResources () {

await getToken()

let res = await runner('az account list --output json --query "[].{id:id,name:name}"')
if (argv.subExclude) {
   res = res.filter(s => !s.id.match(argv.subExclude))
}

if (argv.subInclude) {
  
   res = argv.subInclude.split(',').map(e => {
      return res.find(s => s.id == e)
   })
   console.log(res)
   //res = res.filter(s => !s.id.match(argv.subExclude))
}



   res.map((item) => {
      let mode
      if (argv.tag) {
         mode = `az resource list --subscription ${item.id} --output json --query "[].{id:id}" --tag "${argv.tag}"`
      } else {
         mode = `az resource list --subscription ${item.id} --output json --query "[].{id:id}"`
      }
      
      subs.push(item.id)
      subsNnames.push({id:item.id,subName:item.name})

      item.runContext= {
         fn: runner,
         schema,
         mode
      }
   })

   process.env.subs = JSON.stringify(subsNnames)
   
   
 
   await batchThrottled(argv.batch,res)
   return resa
   //var wa = await batchThrottled(argv.batch,res)
 /*   var r = [];
   //makeSingleArray(wa,r)


   console.log('batch size was', res.length, ': - batch is completed')
   
   fs.writeFileSync('content.json', JSON.stringify(r))
   var d = fs.readFileSync('content.json',{encoding:'utf8'})

   fs.writeFileSync('content.json',beautify(d,{ indent_size: 2, space_in_empty_paren: true })) */


}


module.exports ={listAllResources}


