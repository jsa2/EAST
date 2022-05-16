const { default: axios } = require("axios");
const fs = require('fs')
main()


async function main() {

    let arr = [
        {
            name:"microsoft.graph",
            cacheName:"graphToken.json"
        },
        {
            name:"microsoft.graph",
            cacheName:"graphToken2.json"
        },
        {
            name:"self",
            cacheName:"iamToken.json"
        },
        {
            name:"graph",
            cacheName:"aadToken.json"
        },
    ]
    

    for await (res of arr) {

        let data = require('../portalauth.json')

        data.extensionName = "Microsoft_Azure_AD"
        data.resourceName = res.name
        console.log(res)
    let {data:val} =await axios("https://portal.azure.com/api/DelegationToken?feature.cacheextensionapp=false&feature.internalgraphapiversion=true&feature.tokencaching=true", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en",
    "content-type": "application/json",
    "cookie": "browserId=8cff5942-820a-4246-b31c-9eca8d845e0e; portalId=8cff5942-820a-4246-b31c-9eca8d845e0e",
  },data,

  "method": "POST"
}).catch(error => console.log(error?.response))

fs.writeFileSync(`./plugins/session/${res.cacheName}`,`{"${val.value.authHeader.split('Bearer ')[1]}"}`)


    }

   




}