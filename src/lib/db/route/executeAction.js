const pool = global.pool

function execute(query,params){
    return new Promise( (resolve,reject)=>{
        setTimeout(()=>{
            pool.getConnection((err, db) => {
                if (err) reject(err);
                db.execute(query,params, (err, rows, fields) => {
                    if (err) reject(err);
                    resolve(rows);
                    db.release();
                });
             })
        },0);
    })
}

module.exports = {
    execute,
};