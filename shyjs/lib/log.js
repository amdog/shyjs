const fs = require('fs')
const path = require('path')
const { isObject } = require('./kit.js')

function buildDir(template) {
    if (fs.statSync(global.config.logDir).isDirectory()) {
        fs.readdir(global.config.logDir, (e, farry) => {
            if (!farry.includes('log')) {
                fs.mkdir(path.join(global.config.logDir, 'log'), () => {
                    writeLog(template)
                })
            } else {
                writeLog(template)
            }
        })
    }
}

let now_log = 0
let LOG = ''

function log(hinge, error) {
    let template = ''
    let date = new Date().toString()
    if (isObject(hinge)) {
        template = `${date} ${hinge.method} ${hinge.url} ${error}   \n`
    }
    now_log++
    LOG += template
    if (now_log == global.config.cacheLog) {
        buildDir(LOG)
        LOG = ''
    }
}

function writeLog(template) {
    let now = new Date()
    let nowFile = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDay()}.log`
    let filePath = path.join(global.config.logDir, '/log', nowFile)
    fs.readdir(path.join(global.config.logDir, '/log'), (e, files) => {
        toNull(e)
        if (files.includes(nowFile)) {
            fs.appendFile(filePath, template, e => {
                toNull(e)
            })
        } else {
            fs.writeFile(filePath, template, e => {
                toNull(e)
            })
        }
    })
}
module.exports = { log }