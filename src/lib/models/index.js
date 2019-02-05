let models;
let query = require("./query")

let mod = {}

function getAttrib(attrs){
    let attr = [];
    attrs.forEach(element => {
        attr.push({name:element["name"],type:element["type"]});
    })

    return attr
}

function generateModels(modelObj){
    Object.keys(modelObj).forEach(element => {

        mod[element] = {}
    
        let attrs = getAttrib(modelObj[element].attr)
        mod[element].attrs = [];
        attrs.forEach(elementAtrib => {
            mod[element]['attrs'][elementAtrib.name]=null
            /*Object.defineProperty(mod[element], elementAtrib.name, {
                type:elementAtrib.type,
                enumerable: false,
                writable: true,
                configurable: false,
                value:null
            })*/
        });
        
    
        mod[element].get = function(id, condiccion = false){
            console.log(id)
            return
        }
    
        mod[element].save=function(){
            let query = query.prepareQueryInsert(this.attrs)
            let sql = "insert into "+m+" "+query.into+" values "+query.values;
            return new Promise( (resolve,reject)=>{
                setTimeout(()=>{
                    pool.getConnection((err, db) => {
                        if (err) reject(err);
                        db.execute(sql,query.params, (err, rows, fields) => {
                            if (err) reject(err);
                            resolve(rows);
                            // get(model,attr,rows.insertId).then(rowGet=>{
                                // resolve(rowGet);
                            // }).catch(errorGet=>{
                                // reject(errorGet);
                            // })
                            db.release();
                        });
                    })
                },0);
            })
        }
    
        mod[element].delete=function(){
            console.log("Delete")
        }
    
        
    });
}





// let elem = {}
// Object.keys(mod).forEach(element => {
//     elem[element] = mod[element]
// })

module.exports = {
    generateModels:function(modelObj){
        generateModels(modelObj)
        return mod
    }
}

