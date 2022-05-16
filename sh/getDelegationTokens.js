const { default: axios } = require("axios");
const fs = require('fs')

//Experimental

main()
async function main() {

    let arr = [
        {
            name:"loganalyticsapi",
            cacheName:"sessionToken.json",
            extensionName:"Microsoft_Azure_MonitoringA"
        },
        {
            name:"microsoft.graph",
            extensionName:"microsoft_AAD_IAM",
            cacheName:"graphToken.json"
        },
        {
            name:"microsoft.graph",
            extensionName:"microsoft_AAD_IAM",
            cacheName:"graphToken2.json"
        },
        {
            name:"self",
            cacheName:"iamToken.json",
            extensionName:"microsoft_AAD_IAM"
        },
        {
            name:"graph",
            cacheName:"aadToken.json",
            extensionName:"microsoft_AAD_IAM"
        },
    ]
    

    for await (res of arr) {

        let data = require('./portalauth.json')
        let cookie = require('./delegationGuids.json').cookies
        data.extensionName = res?.extensionName || "Microsoft_Azure_AD"
        data.resourceName = res.name
        console.log(res)
    let {data:val} =await axios("https://portal.azure.com/api/DelegationToken?feature.cacheextensionapp=false&feature.internalgraphapiversion=true&feature.tokencaching=true", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en",
    "content-type": "application/json",
    cookie,
  },data,

  "method": "POST"
}).catch(error => console.log(error?.response))

try {
    fs.writeFileSync(`./plugins/session/${res.cacheName}`,`"${val.value.authHeader.split('Bearer ')[1]}"`)


} catch(error) {
    console.log(error)
}

    }

   




}