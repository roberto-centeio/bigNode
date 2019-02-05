// const modelsDb = require("../models")
const mysql = require('mysql2');
const _ = require("lodash")
const db = require("../../../config/index").db;
const modules = require("../../../config/modules").modules
const database = db.database

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
  port : db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function dateType(attr){
  let type = "";
  switch(attr.type){
    case "number":
      type = "INT";
      break;
    case "string":
      length = attr.maxlength ? attr.maxlength :1000;
      type = "VARCHAR("+length+")";
      break;
    case "date":
      type = "DATE";
      break;
    case "datetime":
      type = "DATETIME";
      break;
    case "boolean":
      type = "INT";
      break;
    case "time":
      type = "TIME";
      break;
    case "email":
      type = "INT";
      break;
    case "double":
      type = "DOUBLE";
      break;
    default:
      type = "TEXT";
      break;
  }
  return type;
}  

function getColumn(attr,model){
    let name = attr.name;
    let required = attr.required ? " NOT NULL " : " NULL";
    let autoincremen = attr.auto_increment ? " AUTO_INCREMENT " : "";
    let primary = attr.primary ? " ,PRIMARY KEY (`"+name+"`) " : "";
    let unique = attr.unique ? "unique" : "";
    let foreign = attr.foreign ? attr.foreign : false;
    let sqlForeign = "";
    let type = dateType(attr)


    if(foreign){
      let foreignModel = foreign["model"] ? foreign["model"] : false; 
      let foreignKey = foreign["key"] ? foreign["key"] : false;

      if( !foreignModel || !foreignKey){
        throw ("Error in create key foreign " + name);
      }

      let fk = "fk_"+model+"_"+foreignKey;
      sqlForeign = " ,INDEX `"+fk+"_"+name+"x` (`"+foreignKey+"` ASC)";
      sqlForeign = sqlForeign + ", CONSTRAINT `"+fk+"` FOREIGN KEY (`" +name+"`)";
      sqlForeign = sqlForeign + " REFERENCES `"+foreignModel+"`  (`"+foreignKey+"`)";
      sqlForeign = sqlForeign + " ON DELETE CASCADE ON UPDATE CASCADE";
    }

    let column = "`"+attr.name+"` "+type + required + autoincremen + unique + primary + sqlForeign + " ";
    return column;
}

function createTable(modelsDb){
    let tables = Object.keys(modelsDb)
    tables.forEach(element=>{
        let attr = modelsDb[element].attr
        let sql = "CREATE TABLE " + element.toLowerCase() +" (";
        attr.forEach((attrElemet,index) => {
          sql = sql + getColumn(attrElemet,element);
          if( (attr.length-1) != index)
            sql = sql +",";  
        });
        sql = sql + ")"
        pool.execute(sql,function(error,result,filds){
          console.log("Table: "+element + " => " +(error ? error.sqlMessage : "SUCCESS"))
        });
    }) 
    //  
}

function infoTable(table){
  let sql = "SELECT distinct col.COLUMN_NAME,DATA_TYPE,IS_NULLABLE,EXTRA,COLUMN_KEY,COLUMN_KEY,CHARACTER_MAXIMUM_LENGTH,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME,CONSTRAINT_NAME"+ 
  " FROM INFORMATION_SCHEMA.COLUMNS col left join INFORMATION_SCHEMA.KEY_COLUMN_USAGE keyCol"+  
  " on col.TABLE_NAME=keyCol.TABLE_NAME and col.COLUMN_NAME=keyCol.COLUMN_NAME"+ 
   " WHERE col.TABLE_NAME = '"+table+"' and col.TABLE_SCHEMA ='"+database+"'"
  //  +" ORDER BY col.ORDINAL_POSITION "
  let tables = [];

  return new Promise( (resolve,reject)=>{
    setTimeout(()=>{
        pool.getConnection((err, db) => {
            if (err) reject(err);
            db.execute(sql, (err, rows, fields) => {
                if (err) reject(err);
                rows.forEach(element => {
                  let table = {};
                  table["name"] = element.COLUMN_NAME;
                  table["type"] = element.DATA_TYPE;
                  element.IS_NULLABLE == "NO" && (table["required"] = true);
                  element.EXTRA == "auto_increment" && (table["auto_increment"] = true);
                  element.COLUMN_KEY == "PRI" && (table["primary"] = true);
                  element.COLUMN_KEY == "MUL" && (table["foreign"] = { "model":element.REFERENCED_TABLE_NAME,"key":element.REFERENCED_COLUMN_NAME,"constraintName":element.CONSTRAINT_NAME});
                  !_.isNil(element.CHARACTER_MAXIMUM_LENGTH) && (table["maxlength"] = element.CHARACTER_MAXIMUM_LENGTH);
                  element.COLUMN_KEY == "UNI" && (table["unique"] = true);
                  tables.push(table)
                });
                resolve(tables)
                db.release();
            });
         })
    },0);
  })

}
  
function removeColumn(table,attr){

  return new Promise((resolve,reject)=>{

    let sql = "";
    let name = attr.name;
    if(_.isNil(attr.foreign))
    {
      sql = "ALTER TABLE "+table+" DROP "+name;
      setTimeout(()=>{
        pool.execute(sql,function(error,result,filds){
          if(error){
            reject("Remove Column: "+name + " => " +error.sqlMessage)
            return ;
          }
          resolve("Remove Column: "+name + " => SUCCESS")
        });
      },0)
    }else{
      let constraintName = attr.foreign.constraintName;
      sql = "ALTER TABLE "+table+" DROP FOREIGN KEY "+constraintName
      sql1 = "ALTER TABLE "+table+" DROP "+name;
      setTimeout(()=>{
        pool.execute(sql,function(error,result,filds){
          pool.execute(sql1,function(error1,result1,filds1){
            if(error1){
              reject("Remove Column: "+name + " => " +error1.sqlMessage)
              return ;
            }
            resolve("Remove Column: "+name + " => SUCCESS")
          });
        });
      },0)
    }
  })
  
}

function addColumn(table,attr){
  if(attr.foreign.key){
    let foreign = attr.foreign;
    let name = attr.name;
    delete attr["foreign"];
    let sql = "ALTER TABLE "+table+" add "+getColumn(attr,table);
    setTimeout(()=>{
      pool.execute(sql,function(error,result,filds){
        if(!error){
          let foreignModel = foreign["model"] ? foreign["model"] : false; 
          let foreignKey = foreign["key"] ? foreign["key"] : false;

          if( !foreignModel || !foreignKey){
            throw ("Error in create key foreign " + name);
          }

          let fk = "fk_"+table+"_"+foreignKey;
          let sqlForeign = " ADD CONSTRAINT `"+fk+"` FOREIGN KEY (`" +name+"`)";
          sqlForeign = sqlForeign + " REFERENCES `"+foreignModel+"`  (`"+foreignKey+"`)";
          sqlForeign = sqlForeign + " ON DELETE CASCADE ON UPDATE CASCADE";
          let sql2 = "ALTER TABLE  "+table+sqlForeign;
          pool.execute(sql2,function(error1,result1,filds1){
            console.log("Add Column: "+name + " => " +(error1 ? error1.sqlMessage : "SUCCESS"))
          });
        }
      });
    },0)
  }else{
    let sql = "ALTER TABLE "+table+" add "+getColumn(attr,table);
    setTimeout(()=>{
      pool.execute(sql,function(error,result,filds){
        console.log("Add Column: "+attr.name + " => " +(error ? error.sqlMessage : "SUCCESS"))
      });
    },0)
  }
  
}

function modifyColumn(table,attr){
  let sql = "ALTER TABLE "+table+" MODIFY "+getColumn(attr,table);
  setTimeout(()=>{
    pool.execute(sql,function(error,result,filds){
      console.log("MODIFY Column of "+table+": "+attr.name + " => " +(error ? error.sqlMessage : "SUCCESS"))
    });
  },0)
}

function modifyFOREIGNKEY(table,attr,infoColumn){
  removeColumn(table,infoColumn).then(resolve=>{
    let sql2 = "ALTER TABLE "+table+" ADD CONSTRAINT fk_"+table+"_"+attr.name+
    " FOREIGN KEY("+attr.name+") REFERENCES "+attr.foreign.model+" ("+attr.foreign.key+") ON DELETE CASCADE ON UPDATE CASCADE"  
    
    delete attr["foreign"];
    let sql1 = "ALTER TABLE "+table+" ADD "+getColumn(attr,table);
    
    setTimeout(()=>{
      pool.execute(sql1,function(error,result,filds){
        if(!error){
          pool.execute(sql2,function(error1,result1,filds1){
            console.log("MODIFY Column of "+table+": "+attr.name + " => " +(error1 ? error1.sqlMessage : "SUCCESS"))
          });
        }
      });
      
    },0)
  }).catch(reject=>{
    console.log(reject)
  })
  
}

function checkModify(attr,infoColumn,element){
  infoColumn.type = (infoColumn.maxlength && infoColumn.type.toLowerCase()=="varchar")?
   infoColumn.type + "("+infoColumn.maxlength+")" : infoColumn.type;
    
   if( attr.foreign){
      if(dateType(attr).toLowerCase() != infoColumn.type.toLowerCase() || 
      attr.required != infoColumn.required || 
      attr.unique != infoColumn.unique ||
      attr.primary != infoColumn.primary ||
      attr.auto_increment != infoColumn.auto_increment ||
      attr.foreign.key != (infoColumn.foreign ? infoColumn.foreign.key : false )|| 
      attr.foreign.model != (infoColumn.foreign ? infoColumn.foreign.model : false )
      ){
        modifyFOREIGNKEY(element,attr,infoColumn);
        return true;
      }
    }
    
    if(dateType(attr).toLowerCase() != infoColumn.type.toLowerCase() || 
    attr.required != infoColumn.required || 
    attr.unique != infoColumn.unique ||
    attr.primary != infoColumn.primary ||
    attr.auto_increment != infoColumn.auto_increment
    ){
      modifyColumn(element,attr);
      return true;
    }
    return false;
}

function alterTable(modelsDb){

  let tables = Object.keys(modelsDb)
    tables.forEach(element=>{
      let attr = modelsDb[element].attr
      infoTable(element).then(resolve=>{

        attr.forEach(elementAttri => {
          let index = _.findIndex(resolve,{name:elementAttri.name});
          if(index == -1){
            addColumn(element,elementAttri)
          }else{
            checkModify(elementAttri,resolve[index],element)
          }
        });

        resolve.forEach(elementAttri => {
          if(_.findIndex(attr,{"name":elementAttri.name}) == -1){
            removeColumn(element,elementAttri).then(resolve=>{
              console.log(resolve)
            }).catch(reject=>{
              console.log(reject)
            })
          }
        });
        return
        
      }).catch(reject=>{
        console.log(reject)
      })
    })   
}


let command = process.argv[2];
let modelsCommand = process.argv[3];
let models = "";

function getModels(){
    modules.forEach(element => {
      if( element.route === '/'+modelsCommand){
        models = require("../../../"+element.path+"/"+element.models);
        return;
      }
    });
}

getModels();

if( command === "alter"){
  console.log("------ Alter -------")
  alterTable(models);
  // console.log("------ Alter Finish -------")
}
else if( command === "create"){
  console.log("------ Create -------")
  createTable(models);
  // console.log("------ Create Finish -------")
}
else{
  console.log(" ---- Error action  ------");
  
}