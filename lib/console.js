const path = require('path')

function printInfo(config) {
    console.log(`
Info                 Mode         
-------------------------
@Debug         |    ${config.mode}
@RecordLog     |    ${path.join(config.logDir? config.logDir:'','./log')} 
`)
    console.log('-Version   :\x1B[33m%s\x1b[0m', config.version)
    console.log('-Entry file:\x1B[33m%s\x1b[0m', ' ' + process.argv[1])
    console.log('-Pid       : \x1B[33m%s\x1b[0m', `${process.pid}`)
    console.log('-Running   : \x1B[33m%s\x1b[0m', `http://localhost:${config.port}`)
}
module.exports = { printInfo }