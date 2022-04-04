function returnObjectInit (item,filename) {
    
    this.name = item.name
    this.id = item.id
    this.fileName = filename
    this.isHealthy = false
    this.metadata = undefined

    return this

}

module.exports={returnObjectInit}