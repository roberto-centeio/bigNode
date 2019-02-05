'use strict';

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'myTeste',
  password:"casa"
});

connection.execute(
    'Insert into `users` (username,age,date) values(?,?,?)',
    ["robert6","24","2018-12-12" ],
    (err, results, fields) => {
      console.log(fields)
    //   console.log(results); // results contains rows returned by server
    //   console.log(fields); // fields contains extra meta data about results, if available
      console.log(err ? err.sqlMessage : results.insertId)
      // If you execute same statement again, it will be picked form a LRU cache
      // which will save query preparation time and give better performance
      connection.close()
    }
  );
  

// // execute will internally call prepare and query
// connection.execute(
//   'SELECT * FROM `users` WHERE `id` = ? AND `age` > ?',
//   [1, 10],
//   (err, results, fields) => {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//     console.log(err)
//     // If you execute same statement again, it will be picked form a LRU cache
//     // which will save query preparation time and give better performance
//   }
// );