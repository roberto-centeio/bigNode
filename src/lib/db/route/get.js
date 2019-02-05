const util = require("../lib/utils")
const pool = global.pool

function queryReturn(retur){
    let sql = "";
    let values = [];
    retur.forEach((element,index) => {
        sql = sql + "?"
        values.push(element);
        if((retur.length-1)){
            sql = sql + ",";
        }
    });
    return {
        sql,
        values
    }
}

function gets(model,attr,condiction=false,retun = false){
    let sql = "select ";
    let values = [];
    if(retun){
        sql = sql + retun;
        // let query = queryReturn(retun);
        // sql = sql + query.sql;
        // values = query.values;    
    }
    else{
        sql = sql + " * ";
    }
    sql = sql + " from "+model;

    if(condiction){
        sql = sql + " where " + condiction
    }

    return new Promise( (resolve,reject)=>{
        setTimeout(()=>{
            pool.getConnection((err, db) => {
                if (err) reject(err);
                db.execute(sql,values, (err, rows, fields) => {
                    if (err) reject(err);
                    resolve(rows);
                    db.release();
                });
             })
        },0);
        
    })
}

function get(model,attr,params,condiction=false,retun = false){
    let sql = "select ";
    let values = [];
    if(retun){
        sql = sql + retun; 
    }
    else{
        sql = sql + " * ";
    }
    sql = sql + " from "+model+" where "+util.getPrimary(attr) +" = ?";

    if(condiction){
        sql = sql + " and " + condiction
    }
    
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
     gets,get
}