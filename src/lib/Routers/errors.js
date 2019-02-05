const server = require("../server").server
const log = require("../logging").log


server.post("/errors",function(req,res){

    try {

        if(!req.body){
            res.status(400)
            res.send({msg:"don't have keys errors"})
        }else{
            log.error(req.body)
            res.send("done!")
        }

    } catch (error) {
     
        log.error(error)
    }
    
    
})