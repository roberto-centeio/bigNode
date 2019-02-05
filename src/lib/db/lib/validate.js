const _ = require("lodash")

function validateTime (format,value){

    if(_.isNil(value))
    {
        return value + " Time invalid"
    }

    let separetor = (format).search(":") ? ":" : -1;
    
    if(separetor == -1){
        return value + " Time invalid"
    } 

    let formatSep = String(format).split(separetor);
    let error = 0;
    let time = String(value).split(separetor);

    if (time.length != formatSep.length ){
        return  value + " Invalid Time for format '"+format+"'";
    }

    formatSep.forEach((element,index) => {
        if (/H{1,2}/gmi.test(element)){
            let hours = time[index];
            if(Number(hours) > 23)
            {
                error = value + " Invalid Time for format '"+format+"'";
                return;
            }
        }

        if (/m{1,2}/gmi.test(element)){
            let minute = time[index];
            if(Number(minute) > 59)
            {
                error = value + " Invalid Time for format '"+format+"'";
                return;
            }
        }
        
        if (/s{1,2}/gmi.test(element)){
            let second = time[index];
            if(Number(second) > 59)
            {
                error = value + " Invalid Time for format '"+format+"'";
                return;
            }
        }
    });
    return error;
}

function validateDate ( format, value){
    if(_.isNil(value))
    {
        return value + " Time invalid"
    }
    
    let separetor = (format).search("-") > 0 ? "-" : "/";
    let formatSep = (format).split(separetor);
    let error = 0;
    let date = (value).split(separetor);

    if (date.length != 3){
        return  value + " Invalid Date for format '"+format+"'";
    }

    formatSep.forEach((element,index) => {
        if (/Y{1,4}/gmi.test(element)){
            let years = date[index];
            if(!Number(years) || String(years).length > 4)
            {
                error = value + " Invalid Date for format '"+format+"'";
                return;
            }
        }

        if (/d{1,2}/gmi.test(element)){
            let days = date[index];
            if(!Number(days) || days > 31 || days == 0)
            {
                error = value + " Invalid Date for format '"+format+"'";
                return;
            }
        }
        
        if (/m{1,2}/gmi.test(element)){
            let month = date[index];
            if(!Number(month) || month > 12 || month == 0)
            {
                error = value + " Invalid Date for format '"+format+"'";
                return;
            }
        }
    });
    return error;
}

 function string(attr,value){
    let label =  attr.label ? attr.label : attr.name;
    let minLength = attr.minlength ? attr.minlength : 0;
    let lengthValue = value ? value.length : 0;
    let attrLength = attr.maxlength ? attr.maxlength : 999999999999999999999999999;
    

    if(attr.required  && !value){
        return label + " is required!";
    }
    
    if(lengthValue > attrLength || lengthValue < minLength){
        return label + " inside " + minLength + " until " + attrLength;
    }
    

    if(attr.match && !(new RegExp(attr.match).test(value))){
        return label + " don't matches!";
    }

    if(attr.enum && !(attr.enum).includes(value)){
        return label + " don't includes in " + JSON.stringify(attr.enum);
    }
    return 0;
}

function number(attr,value){
    let label =  attr.label ? attr.label : attr.name;
    let min = attr.min;
    let max = attr.max;
    
    if(attr.required  && !value){
        return label + " is required!";
    }
    
    if(value > max || value < min){
        return label + " inside " + min + " until " + max;
    }
    if(!Number(value)){
        return label + " isn't a number";
    }
    return 0;
}

function double(attr,value){
    let label =  attr.label ? attr.label : attr.name;
    let min = attr.min;
    let max = attr.max;
    
    if(attr.required  && !value){
        return label + " is required!";
    }
    
    if(value > max || value < min){
        return label + " inside " + min + " until " + max;
    }
    
    if(!Number(value)){
        return label + " isn't a double";
    }
    return 0;
}

function email(attr,param){
    let label =  attr.label ? attr.label : attr.name;
    let minLength = attr.minlength ? attr.minlength : 0;
    let lengthValue = value ? value.length : 0;
    let attrLength = attr.maxlength ? attr.maxlength : 999999999999999999999999999;
    

    if(attr.required  && !value){
        return label + " is required!";
    }

    if(value.match(/.*@.*\.com/)){
        return value + " isn't email!";
    }
    
    if(lengthValue > attrLength || lengthValue < minLength){
        return label + " inside " + minLength + " until " + attrLength;
    }

    if(typeof(value) != "string"){
        return label + " isn't email!";
    }
    return 0;
}

function time(attr,value){
    if(attr.required  && !value){
        return label + " is required!";
    }
    let format = attr.format ? attr.format : "HH:MM:SS"
    return validateTime(format,value);
}

function datetime(attr,value){
    if(attr.required  && !value){
        return label + " is required!";
    }
    let format = attr.format ? attr.format : "YYYY-MM-DD HH:MM:SS"
    let datetime = (attr.format).split(" ");
    let valueDateTime = (value).split(" ");
    if( datetime.length == 2 ){
        let error = validateDate(datetime[0],valueDateTime[0]);
        
        if( error === 0){
            return validateTime(datetime[1],valueDateTime[1])
        }else{
            return error;
        }  
    }else{
        return value + " Invalid DateTime";
    }
}

function date(attr,value){
    if(attr.required  && !value){
        return label + " is required!";
    }

    if(new Date(value) === "Invalid Date"){
        return value + " Invalid Date";
    }

    let format = attr.format ? attr.format : "YYYY-MM-DD"
    return validateDate(attr.format,value);
}

function boolean(attr,value){
    if(attr.required  && !value){
        return label + " is required!";
    }

    if(![true,false,1,0,'1','0','true','false'].includes(value)){
        return value + " isn't boolean!";
    }
    return 0;
}


module.exports = {

    validate:function(atrib,param){
        let timeStart = process.hrtime()[1];
        let errors = [];
        atrib.forEach(element => {
            // console.log(element.auto_increment)
            // if(element.auto_increment){
                // return;
            // }

            if(String(element.type).toLowerCase() == "string"){
                let error = string(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            if(String(element.type).toLowerCase() == "number"){
                // errors.push(number(element,param[element.name]));
                let error = number(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            if(String(element.type).toLowerCase() == "double"){
                // errors.push(double(element,param[element.name]));
                let error = double(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            if(String(element.type).toLowerCase() == "datetime"){
                // errors.push(datetime(element,param[element.name]));
                let error = datetime(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            if(String(element.type).toLowerCase() == "date"){
                // errors.push(date(element,param[element.name]));
                let error = date(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            if(String(element.type).toLowerCase() == "time"){
                // errors.push(time(element,param[element.name]));
                let error = time(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            if(String(element.type).toLowerCase() == "email"){
                // errors.push(email(element,param[element.name]));
                let error = email(element,param[element.name]);
                if(error != 0){
                    let err = {}
                    err[element.name]=error
                    errors.push(err);
                }
            }
            
        });
        let timeEnd = process.hrtime()[1];
        // console.log((timeEnd - timeStart)/60 + "ss")
        return errors;
        
    },
}