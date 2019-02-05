
const fs = require('fs');


module.exports = function(nameFile,txt){
    fs.appendFile(nameFile, txt, (err) => {  
        if (err) throw err;
    });
}