const { default: axios } = require("axios")
const { array } = require("yargs")
const { batchThrottledSimple } = require("../plugins/nodeSrc/batch")
const { responseSchema } = require("../plugins/nodeSrc/functionResponseSchema")
const { getGraphToken } = require("../plugins/nodeSrc/getToken")
const { returnObjectInit } = require("../plugins/nodeSrc/returnObjectInit")
const {graph, genericGraph2} = require('../plugins/nodeSrc/graph')
let waiTf = require('util').promisify(setTimeout)

//test(require('../content.json'))

async function test (src)  {
    let prm = []
    let apps = src.filter(s => s.controlId == "Subscriptions_roleAssignmentsRGAdvanced")
    .map(s => s.metadata.assigments.filter(s => s.principalType == 'Application'))
    var token = await getGraphToken()
    var throttleCount = 7
    var c = 0
    for await (app of apps.flat(1)) {
         console.log(app.principalId)
        c++
        if (c % throttleCount == 0) {
            await waiTf(1000)
        }
        let opt = {
            url:`https://graph.microsoft.com/v1.0/directoryObjects/${app.principalId}/owners?$select=id,displayName`,
            headers:{authorization: `Bearer ${token}`},
            refInfo: app
        }
        prm.push(genericGraph2(opt))

    }

    let directs = src.filter(s => s.controlId == "Subscriptions_roleAssignmentsRGAdvanced")
    .map(s => s.metadata.assigments.filter(s => s.principalType == 'User')).flat()

    let owners = await (await Promise.all(prm)).filter(s => s?.owner !== undefined)
    let indirects = []
    owners.map(s => {
        s.owner.map(d => {
            item.isHealthy="review"
        let hasDirectAlso = directs.find(mn => mn.principalId == d.id && mn.subName == s?.refInfo.subName) || "No roles with direct access"
        
        indirects.push({
            hasDirectAlso,
            indirectUser:d.displayName,
            principalId:d.id,
            indirectRoleName:s?.refInfo.RoleName,
            indirectAccessVia:s?.refInfo.friendlyName,
            subName:s?.refInfo.subName,
        }) 
        })

 })

 let item=  new returnObjectInit({id:"general",name:"privEsc"},__filename.split('/').pop())
 item.isHealthy=true
 item.metadata= indirects
 console.log(indirects)

 return new responseSchema(item, {Category:"Access",Description:"Review objects with indicrect access to subscriptions"})



}
module.exports = async function (src){
    let prm = []
    let item=  new returnObjectInit({id:"general",name:"composite_Privilege_Escalation"},__filename.split('/').pop())
    item.isHealthy= true
    let apps = src.filter(s => s.controlId == "Subscriptions_roleAssignmentsRGAdvanced")
    .map(s => s.metadata.assigments.filter(s => s.principalType == 'Application'))

    if (!apps?.length) {
        return;
    }

    var token = await getGraphToken()
    var throttleCount = 7
    var c = 0
    for await (app of apps.flat(1)) {
         console.log(app.principalId)
        c++
        if (c % throttleCount == 0) {
            await waiTf(1000)
        }
        let opt = {
            url:`https://graph.microsoft.com/v1.0/directoryObjects/${app.principalId}/owners?$select=id,displayName`,
            headers:{authorization: `Bearer ${token}`},
            refInfo: app
        }
        prm.push(genericGraph2(opt))

    }

    let directs = src.filter(s => s.controlId == "Subscriptions_roleAssignmentsRGAdvanced")
    .map(s => s.metadata.assigments.filter(s => s.principalType == 'User')).flat()

    let owners = await (await Promise.all(prm)).filter(s => s?.owner !== undefined)
    let indirects = []
    owners.map(s => {
        s.owner.map(d => {
        
        let hasDirectAlso = directs.find(mn => mn.principalId == d.id && mn.subName == s?.refInfo.subName) || "No roles with direct access"
        
        indirects.push({
            indirectUser:d.displayName,
            principalId:d.id,
            indirectRoleName:s?.refInfo.RoleName,
            indirectAccessVia:s?.refInfo.friendlyName,
            subName:s?.refInfo.subName,
            hasDirectAlso
        }) 
        })

 })




 item.metadata= indirects

 if (indirects.length > 0) {
    item.isHealthy=false
 }
// console.log(indirects)

 return new responseSchema(item, {Category:"Access",Description:"Review objects with indicrect access to subscriptions via SPN"})



}