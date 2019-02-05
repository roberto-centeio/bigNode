const bunyan = require('bunyan');
const fileLogging = require('../config/index').logging.fileError; 
const file = require("./file")

function fileErrorStream(filePath) {
  return {
    write: log => {
      log.level = bunyan.nameFromLevel[log.level];
      log.time = new Date().toISOString();
      // var logLine = JSON.stringify(log, bunyan.safeCycles(), 2);
      myLog = log
      
      txt = "\n"+myLog.time+" "+String(myLog.level).toUpperCase() + " "
      delete myLog.time;
      delete myLog.level;
      delete myLog.v;
      delete myLog.name;
      delete myLog.hostname;
      delete myLog.pid;
      txt = txt + JSON.stringify(myLog, bunyan.safeCycles())
      file(fileLogging,txt);
      return log
    }
  };
}

const log = bunyan.createLogger({
    name: require('../config/index').name,  
    streams: [
        {
          level: 'info',
          stream: process.stdout            // log INFO and above to stdout
        },
        {
          level: 'error',
          path: fileLogging,  // log ERROR and above to a file
          stream: new fileErrorStream(),
          type: 'raw',
        }
      ],
    // serializers: {
      // err: bunyan.stdSerializers.err,   // <--- use this
    // }         
});



log._emit = (rec, noemit) => {
    
  !rec.msg && delete rec.msg;
  bunyan.prototype._emit.call(log, rec, noemit);
}


module.exports = {
  log
}