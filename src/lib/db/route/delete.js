const util = require("../lib/utils")
const pool = global.pool

function deleteQuery(model,attr,params){
    let sql = " delete from "+model+" where "+util.getPrimary(attr) +" = ?";
    return new Promise( (resolve,reject)=>{
        setTimeout(()=>{
            pool.getConnection((err, db) => {
                if (err) reject(err);
                db.execute(sql,[params], (err, rows, fields) => {
                    if (err) reject(err);
                    resolve(rows);
                    db.release();
                });
             })
        },0);
        
    })
}

module.exports = {
    delete:deleteQuery
}