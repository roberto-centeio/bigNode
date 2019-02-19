let router = null
let models = null



module.exports={ 
    init:function(routerModule,modelsObj=null){
        this.router = routerModule
        this.models =  modelsObj
        // require("./tesct")
        routerModule.get("/teste",(req,res)=>{
            res.send("ok")
        })

        
    },
    router,
    models
}