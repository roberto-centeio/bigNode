const initServer = require("./lib/server").initServer;
const log = require("./lib/logging").log;
const modules = require("./config/modules").modules;
const db = require("./lib/db/index");
const generateModels = require("./lib/models/index")

var morgan = require('morgan')
 

function loadModules(myServer){
    modules.forEach(element => {
        
        let router = require("express").Router()
        let myModule = require("./"+element.path+"/"+element.run);
        let models = require("./"+element.path+"/"+element.models);

        console.log(element.route,'models')
        myServer.use(element.route,router)
        db.init(router,models)
        myModule.init(router)

    });
}

initServer().then((myServer)=>{
    loadModules(myServer)
    global.server = myServer;
    require("./lib/Routers/errors")
    myServer.use(morgan(':method :url :response-time mss'))
}).catch(()=>{

})


