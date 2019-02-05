var fs = require('fs');

if (!fs.existsSync( __dirname+"/log")) {
    fs.mkdirSync(__dirname+"/log");
}

config = {
    name:"Store",
    logging:{
        fileError :__dirname+"/log/erros.log",
    },
    server:{
        port:5703
    },
    db:{
        host: 'localhost',
        user: 'root',
        password:"casa",
        database: 'myTeste',
        port:3306, 
    }
}


module.exports = config