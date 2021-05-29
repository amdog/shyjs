const fs = require('fs')
const path = require('path')
const { isObject } = require('./kit.js')

function buildDir(template) {
    let config = global.config
    if (fs.statSync(config.logDir).isDirectory()) {
        fs.readdir(config.logDir, (e, farry) => {
            if (!farry.includes('log')) {
                fs.mkdir(path.join(config.logDir, 'log'), () => {
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

function log(req, error) {
    let config = global.config
    let template = ''
    let date = new Date().toString()
    if (isObject(req)) {
        template = `${date} ${req.method} ${req.url} ${error}   \n`
    }
    now_log++
    LOG += template
    if (now_log == config.cacheLog) {
        buildDir(LOG)
        LOG = ''
    }
}

function writeLog(template) {
    let now = new Date()
    let config = global.config
    let nowFile = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDay()}.log`
    let filePath = path.join(config.logDir, '/log', nowFile)
    fs.readdir(path.join(config.logDir, '/log'), (e, files) => {
        if (files.includes(nowFile)) {
            fs.appendFile(filePath, template, e => {})
        } else {
            fs.writeFile(filePath, template, e => {})
        }
    })
}
module.exports = { log }