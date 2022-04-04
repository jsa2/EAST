const { default: axios } = require("axios");
const { connect } = require("net");
const { EventEmitter } = require("stream");
const { v4 } = require("uuid");
const { getToken } = require("./getToken");
var waitT = require('util').promisify(setTimeout)


async function getAppliedNSG (attachment) {

    var token = await getToken()
    const guid = v4()
const headers = {
    "Authorization": "Bearer " + token,
    "content-type": "application/json",
    "x-ms-requestid": guid
  }

  const collecto = []

    const options = {
        url:`https://management.azure.com${attachment}/effectiveNetworkSecurityGroups?api-version=2019-02-01`,
        method:"post",
        headers
        }

        console.log(options.url)
        var errorProp
        try {
            let {headers:follow}=  await axios (options).catch(({response} )=> {

                
               errorProp = response.data
            })


                await waitT(2000)
             
                const res = await waitForNSG(follow.location,[])



                const check = res.map(rule => {

                return rule.effectiveSecurityRules.filter(s => s.access == 'Allow' && s.sourceAddressPrefix == "0.0.0.0/0" && s.direction == "Inbound")
                .map(r => ` ${rule.networkSecurityGroup.id.split('/').pop()}-${r.access} - ${r.destinationPortRange}`)

                })

                return check[0] || "no rules"



        } catch (error) {
            return errorProp?.error || error
        }
     



}



async function waitForNSG (location,receiver) {

 
    let locations = {
        url:location,
        headers:{
            "Authorization": "Bearer " + await getToken(),
            "content-type": "application/json",
          }
    }
    console.log('waiting for NSG results', location)
    
    let netResults=  await axios (locations,receiver)
    await waitT(1500)
    if (netResults?.status == 200 ) {
        if (netResults?.data.value.length == 0) {
            return receiver
        }
        receiver.push(netResults?.data.value)
    } else {
        await waitForNSG(netResults?.headers?.location,receiver)
    }

    return receiver[0]

    
}


module.exports={getAppliedNSG}