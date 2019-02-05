const util = require("../lib/utils")
const pool = global.pool

  function prepareSql(params,primaryKeys){
    let sql = "";
    let values = [];
    let keys = Object.keys(params);
    keys.forEach((element,index) => {
        if(element!=primaryKeys){
            sql = sql + element+"=?";
            if(index != (keys.length-1)){
                sql = sql + ", ";
            }
            values.push(params[element])
        }

    });
    values.push(params[primaryKeys])
    return {
        values,
        sql
    }
  }


function edit(model,attr,params){
    let primaryKeys = util.getPrimary(attr);
    let query = prepareSql(params,primaryKeys);
    let sql = " update  "+model+" set "+query.sql+" where "+primaryKeys +" = ?";
    
    return new Promise( (resolve,reject)=>{
        setTimeout(()=>{
            pool.getConnection((err, db) => {
                if (err) reject(err);
                db.execute(sql,query.values, (err, rows, fields) => {
                    if (err) reject(err);
                    resolve(rows);
                    db.release();
                });
             })
        },0);
    })
}

module.exports = {
    edit
}