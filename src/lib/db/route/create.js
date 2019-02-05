const pool = global.pool
const get = require('./get').get
const _ = require("lodash");

function prepareQuery(attr,vals){
    let into = "(";
    let values = "(";
    let params = [];
    attr.forEach((element,index) => {
        if(!element.auto_increment){
            into = into + element.name+"";
            values = values + "?";

            if(index != (attr.length-1)){
                into = into + ",";
                values = values + ",";
            }
            let value = vals[element.name]
            if(_.isNil(value)){
                value = element.default || "NULL";
            }

            params.push(value)
        }
    });

    into = into + ")";
    values = values + ")";

    return {
        into,
        values,
        params
    }
}

function create(model,attr,params){
    
    let query = prepareQuery(attr,params)
    let sql = "insert into "+model+" "+query.into+" values "+query.values;
    return new Promise( (resolve,reject)=>{
        setTimeout(()=>{
            pool.getConnection((err, db) => {
                if (err) reject(err);
                db.execute(sql,query.params, (err, rows, fields) => {
                    if (err) reject(err);
                    // console.log(rows.insertId)
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

module.exports = {
    create
}