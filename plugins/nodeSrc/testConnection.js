const net = require('net');






function testConnection (host,port) {

    return new Promise((resolve,reject) => {

        const client = net.createConnection({ port, host,timeout:300, allowHalfOpen:true }, () => {
            // 'connect' listener.
            client.destroy()
            return resolve('connected')

    
           //return resolve('connection ok')
          })
          client.on('end', () => {
            console.log('disconnected from server');
          })

          client.on('error', (err) => {
             return resolve(err)
          })
          

    })
}


module.exports={testConnection}