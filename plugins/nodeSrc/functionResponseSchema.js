const { returnObjectInit } = require("./returnObjectInit")

function metaDataCheck(isHealthy,name,metadata,id) {
    //console.log(isHealthy)
    //console.log(typeof(isHealthy))
    return {
        isHealthyTypeIsOk:typeof(isHealthy) === "boolean" || "notApplicable" || "healthy-withExceptions" || "manual", 
        sourceTypeIsOk:typeof(name) === "string", 
        metadatTypeIsOk:typeof(metadata) ==="object",
        idIsOk:typeof(id) === "string", 
        }
    
}

function responseSchema ({
    isHealthy,name,metadata, fileName, id},
    {Description, Category}) {

    const metadataOk = metaDataCheck(isHealthy,name,metadata,id,fileName)
    
    Object.keys(metadataOk).map((key) =>{ if(metadataOk[key] === false ) {
        console.log(isHealthy,name,metadata,id,fileName)
           throw new Error (JSON.stringify({metadataOk}))
       }   
    })

    this.response = {}

    this.response.name = name
    this.response.resource = id
    // Needs to be string
    this.response.controlId = `${fileName.split('.js')[0]}`

    // Needs to be boolean
    this.response.isHealthy = isHealthy

    this.response.id = id
  
    this.response.Description = Description
      //Needs to be object
    this.response.metadata = metadata
    this.response.category = Category || "uncategorized"
    
    return this.response
}

function erroResponseSchema(item,error) {
    this.name = item.split('/').pop() || "check error trace"
    this.id = item || "check error trace"
    this.fileName = "not applicable, provider not supported"
    this.isHealthy = "not applicable, provider not supported"
    this.error = JSON.stringify(error.stack)

    return this
}

module.exports={responseSchema,erroResponseSchema}