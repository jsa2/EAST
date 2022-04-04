const { default: axios } = require("axios")
const { decode } = require("jsonwebtoken")
const { runner } = require("../pluginRunner")
const {policyTemplate } = require("./aadWhatIf")
const { getAADtoken, getAADIamToken } = require("./getToken")
//


module.exports={getBasicAuthStatus,getCaPolicies,getMFAStatus, getAADCAPol}

var caPoliciesx 

async function getCaPolicies () {

    var token = await getAADtoken()
    var tid = decode(token).tid

    var opt = {
      url: `https://graph.windows.net/${tid}/policies?api-version=1.61-internal`,
      "headers": {
        "accept": "*/*",
        "accept-language": "en",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    }
  
    if (!caPoliciesx) {
    var {data:caPolicies} = await axios(opt).catch((error ) => {
      console.log(error?.response?.data)
      return {
        caPolicies: false
       }
    })
    


    caPoliciesx = caPolicies?.value.find((item) => item.policyType == 18) || "no ca policies"
}
 
return caPoliciesx
   
  
  
  }
  

var existing = []



async function getMFAStatus (oid, passedToken) {
  const checkType="mfa"

  var preRes = existing.find(item => item.oid == oid && item.checkType == checkType)
  if (preRes) {
    //console.log('found existing') 
      return preRes
    }

  if (!await getCaPolicies()) {
      return "not evaluation, as there are no CA policies enabled"
  }

  if (!passedToken) {
      var token = await getAADIamToken()
      

  } else {
      var token = passedToken
  }

 // console.log(decode(token))

 var data = policyTemplate(0,oid)
  
  var opt = {
    url:"https://main.iam.ad.ext.azure.com/api/Policies/Evaluate?",
    "headers": {
      "accept": "*/*",
      "accept-language": "en",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-ms-client-request-id": require('uuid').v1(),
      "x-ms-command-name": "PolicyManagement - GetAllEvaluatedPolicies",
      "x-ms-effective-locale": "en.en-us"
    },
      data,
    }

   // console.log(opt)

    const {data:policies} = await axios(opt).catch((error) => {
      console.log(error?.response?.statusText)
      return Promise.reject('eval not available')
    })

    const appliedPol = await policies.filter((pol) => pol.applied == true && pol.policyState == 2).map((policy) => {
      const grants= Object.keys(policy.controls).filter((key ) => (policy.controls[key] == true && policy.applied == true))
      console.log(grants)
      return {GrantConditions:grants[1] || "policy not applied" ,policy:policy.policyName, oid}
    })

     existing.push({oid,appliedPol,checkType})
    return {oid,appliedPol,checkType}

}




async function getBasicAuthStatus (oid, passedToken) {
  const checkType="basicAuth"

  var preRes = existing.find(item => item.oid == oid && item.checkType == checkType)
  if (preRes) {
    //console.log('found existing') 
      return preRes
    }

  if (!await getCaPolicies()) {
      return "not evaluation, as there are no CA policies enabled"
  }

  if (!passedToken) {
    var token = await getAADIamToken()
  } else {
      var token = passedToken
  }

 // console.log(decode(token))

 const data = policyTemplate(1,oid)
  
  var opt = {
    url:"https://main.iam.ad.ext.azure.com/api/Policies/Evaluate?",
    "headers": {
      "accept": "*/*",
      "accept-language": "en",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-ms-client-request-id": require('uuid').v1(),
      "x-ms-command-name": "PolicyManagement - GetAllEvaluatedPolicies",
      "x-ms-effective-locale": "en.en-us"
    },
      data,
    }

    //console.log(opt)

    const {data:policies} = await axios(opt).catch((error) => {
  /*     console.log(oid)
      console.log(error?.response?.statusText) */
      return Promise.reject('eval not available')
    })

    const appliedPol = await policies.filter((pol) => pol.applied == true && pol.policyState == 2).map((policy) => {
      const grants= Object.keys(policy.controls).filter((key ) => (policy.controls[key] == true && policy.applied == true))
      //console.log(grants)
      return {GrantConditions:grants[1] || "policy not applied" ,policy:policy.policyName, oid}
    })

    if (oid == "603828b8-886c-4436-a2ef-84cdb9c60747") {
     // console.log()
    }

     existing.push({oid,appliedPol,checkType})
    return {oid,appliedPol,checkType}

}

async function getAADCAPol () {
  

  var token = await getAADtoken()
  var tid = decode(token).tid

  var opt = {
    url: `https://graph.windows.net/${tid}/policies?api-version=1.61-internal`,
    "headers": {
      "accept": "*/*",
      "accept-language": "en",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  }


  var {data:caPolicies} = await axios(opt).catch((error ) => {
    console.log(error?.response?.data)
    return {
      caPolicies: false
     }
  })
  


  var inlinePol = caPolicies?.value.filter((item) => item.policyType == 18)
  .filter(s => !JSON.stringify(s.policyDetail).match('Disabled'))
  .map(d => {
    return {
      name:d.displayName,
      details: JSON.parse(d.policyDetail)
    }
  }) || "no ca policies"

return inlinePol
 



}



