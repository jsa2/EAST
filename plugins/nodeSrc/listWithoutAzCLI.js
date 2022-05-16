const { getToken } = require("./getToken")
const {argv} = require('yargs')
const { default: axios } = require("axios")

async function listWithoutAzCLI () {

    try  {

       let token =  await getToken()

    let subs = argv.subInclude.split(',')

let r = []
     subs.map(sub => {

        let options = {
            url: `https://management.azure.com/subscriptions/${sub}/resources?api-version=2021-04-01`,
            headers: {
                authorization: `Bearer ${token}`
            }
        }
      
        r.push(subListing(options))
         
     })

     let resources = await Promise.all(r)


     resources = resources.flat().map((rs) => {
         
        return {
             id: rs.id,
             name:rs.name
         }
     })

     return resources
    } catch (error) {
        console.log('resource listing failed');
        return undefined
    }
    
  
}


async function subListing (options) {

   let {data} = await axios(options)

   return data?.value

}

module.exports={listWithoutAzCLI}