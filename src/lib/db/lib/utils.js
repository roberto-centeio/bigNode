const _ = require("lodash")

function getPrimary(attr){
    let name = "";
    attr.forEach(element => {
        if(element.primary){
            name = element.name;
            return; 
        }
            
    });
    return name;
}


function errorFormat(error){
    let errors = {};

    if(typeof(error) === "string"){
        return JSON.stringify({msg:error});
    }

    if(_.isArray(error)){
        let errors  = {}
        error.forEach(element => {
            let key = Object.keys(element)[0]
             errors[key]={"msg":element[key]}
        });

        return JSON.stringify(errors)
    }    
    Object.keys(error).forEach(function(k){
        if(/message/gmi.test(k)){
            errors["msg"]=error[k]
        }else{
            errors[k]=error[k]
        }
         
    })
    return JSON.stringify(errors || error)
}



module.exports = {
     getPrimary,
     errorFormat
}