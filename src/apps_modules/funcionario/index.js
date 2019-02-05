module.exports={ 
    init:function(router){
        router.get("/teste",(req,res)=>{
            res.send("ok")
        })
    }
}