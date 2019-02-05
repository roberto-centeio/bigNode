'use strict';

const pool = require('mysql2').createPool({
  host: 'localhost',
  user: 'root',
  database: 'myTeste',
  password: 'casa'
});

// setInterval(() => {
//   for (let i = 0; i < 5; ++i) {
//     pool.query((err, db) => {
//       console.log(rows, fields);
//       // Connection is automatically released once query resolves
//     });
//   }
// }, 1000);

let time = 0;
let start = new Date()
// let interval = setInterval(() => {
    // setTimeout(()=>{
    time = time + 1;
  for (let i = 0; i < 1000; ++i) {
    pool.getConnection((err, db) => {
      db.query('select * from users', (err, rows, fields) => {
        console.log(rows,i);
        db.release();

        // if(time == 1000){
            // clearInterval(interval)
            // console.log((new Date()-start))
        // }
        console.log((new Date()-start))
      });
    });
  }
  
// }, 0);

