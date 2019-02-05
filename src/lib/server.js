const express = require("express")
const port = require('../config/index').server.port; 
const log = require("./logging").log
const bodyParser = require("body-parser")


module.exports = {
    initServer:function(){
        return new Promise( (resolve,reject)=>{
            setTimeout(()=>{
                try {
                    const server = express()
                    server.listen(port,()=>console.log("Executando Api"))
                    server.use(bodyParser.urlencoded({ extended : true }))
                    server.use(bodyParser.json())
                    resolve(server)
                } catch (error) {
                    log.error(error)
                    reject(error)
                }
            },0);
            
        })
    }
} 