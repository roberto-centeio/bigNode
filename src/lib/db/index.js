const validate = require("./lib/validate").validate
const errorFormat = require("./lib/utils").errorFormat
const getPrimary = require("./lib/utils").getPrimary
const _ = require("lodash")

const pool = require("./config")
global.pool = pool;

const create = require("./route/create").create
const get = require("./route/get")
const edit = require("./route/edit").edit
const delet = require("./route/delete").delete
const execute = require("./route/executeAction").execute

Object.defineProperty(Object.prototype, "getProp", {
    value: function (prop) {
        var key,self = this;
        for (key in self) {
            if (key.toLowerCase() == prop.toLowerCase()) {
                return self[key];
            }
        }
    },
    enumerable: false
});

module.exports={ 
    init:function(router,modelsDb){

        router.use(/.*/,(req,res,next)=>{
            
            let start = Date.now();
            res.setHeader("Content-Type","application/json")
            let urls = (req.originalUrl).split("/"); 
            let models = modelsDb.getProp(urls[2]);

            if(!models){
                next()
                return true;
            }

            let action = (urls[3] && models.getProp(urls[3])) || false;
            let METHOD = req.method;
            let attr = models.attr || false; 
            let modelsStr = urls[2].toLowerCase()
            
            
            if(!action){
                switch(METHOD){
                    case "POST":
                        attr.forEach(element => {
                            if(element.auto_increment){
                                delete attr[element];
                                return;
                            }    
                        });

                        let valit = validate(attr,req.body);
                        if(valit.length == 0){
                            create(modelsStr,attr,req.body).then(resolve=>{
                                res.send(JSON.stringify(resolve))
                            }).catch(reject=>{
                                res.status(400)
                                res.send(errorFormat(reject))
                            })
                        }else{
                            res.status(400)
                            res.send(errorFormat(valit))
                        }
                        break;
                    case "GET":
                        let id = urls[3];
                        console.log(id,"llll",_.isNil(id))
                        if(!_.isNil(id)){
                            get.get(modelsStr,attr,id).then(resolve=>{
                                res.send(JSON.stringify(resolve))
                            }).catch(reject=>{
                                res.status(400)
                                res.send(errorFormat(reject))
                            })
                        }else{
                            
                            get.gets(modelsStr,attr).then(resolve=>{
                                res.send(JSON.stringify(resolve))
                            }).catch(reject=>{
                                res.status(400)
                                res.send(errorFormat(reject))
                            })
                        }
                        
                        break;
                    case "PUT":
                        let attrReq = [];
                        let primaryKey = getPrimary(attr)
                        if( !_.has(req.body,primaryKey) ){
                            res.status(400)
                            res.send(errorFormat(primaryKey + " is required!")) 
                            break;
                        }

                        Object.keys(req.body).forEach(element=>{
                            attrReq.push(attr[_.findIndex(attr, ['name', element])]);
                        }) 

                        let valitPut = validate(attrReq,req.body);
                        if(valitPut.length == 0){
                            edit(modelsStr,attr,req.body).then(resolve=>{
                                res.send(JSON.stringify(resolve))
                            }).catch(reject=>{
                                res.status(400)
                                res.send(errorFormat(reject))
                            })
                        }else{
                            res.status(400)
                            res.send(errorFormat(valitPut))
                        }
                        break;
                    case "DELETE":
                        if(!_.isNil(urls[2])){
                            delet(modelsStr,attr,urls[2]).then(resolve=>{
                                res.send(JSON.stringify(resolve))
                            }).catch(reject=>{
                                res.status(400)
                                res.send(errorFormat(reject))
                            })  
                        }else{
                            res.status(404)
                            res.send(errorFormat("Not Found"))
                        }
                        
                        break;
                    default:
                        res.status(400)
                        res.send(errorFormat("Method not allowed"))
                        break;
                }
                
            }else{
                let query = action.query;
                let params = action.params;
                let body = req.body;
                let myParam  = []; 
                let method = action.method || false;
            
                if(method){
                    if((METHOD).toUpperCase() !=  (method).toUpperCase()){
                        res.status(400)
                        res.send(errorFormat("Method not allowed"))
                        return;
                    }
                }

                if (!query){
                    res.status(400)
                    res.send(errorFormat("Haven't query this action!"))
                    return;
                }

                if(METHOD == "POST" || METHOD == "PUT"){
                    let attrReq = [];
                    params.forEach(element => {
                        myParam.push(body[element])
                        attrReq.push(attr[_.findIndex(attr, ['name', element])]);
                    });

                    valit = validate(attrReq,req.body);
                    if(valit.length != 0){
                        res.status(400)
                        res.send(errorFormat(valit))
                        return
                    }

                }else{
                    let attrReq = [];
                    let paramsValid = {};
                    params.forEach((element,index) => {
                        let param = urls[index+3]
                        if(param){
                            myParam.push(param)
                            paramsValid[element] = param;
                        }
                        attrReq.push(attr[_.findIndex(attr, ['name', element])]);
                            
                    });

                    valit = validate(attrReq,paramsValid);
                    if(valit.length != 0){
                        res.status(400)
                        res.send(errorFormat(valit))
                        return
                    }
                }

                execute(query,myParam).then(resolve=>{
                    res.send(JSON.stringify(resolve))
                }).catch(reject=>{
                    res.status(400)
                    res.send(errorFormat(reject))
                })
            }
            let end = Date.now();
            console.log((end - start) + "mss")
            
        })
    }
}


// server.get("/user",(req,res,next)=>{
//     res.send("Send Ok")
// })

