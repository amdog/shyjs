const { printInfo } = require('../lib/console.js')
const { isObject } = require('../lib/kit.js')
const { send } = require('./response/index.js')
const http = require('http')
const { storeClock } = require('../lib/session.js')
const { defaultConf } = require('../lib/config.js')
const { extractDigest } = require('./request/index.js')


function main(req, res) {
    extractDigest(req, res)
        .then(hinge => {
            send(hinge, res)
        })
};

function deploy(conf) {
    if (!conf) { conf = {} }
    let config = defaultConf(conf)
    global.config = config
    storeClock()
    http.createServer((req, res) => {
        setHeader(res)
        if (req.method == 'OPTIONS') {
            res.end()
        } else {
            main(req, res)
        }
    }).listen(config.port)
    printInfo(config)
}

function setHeader(res) {
    let headers = global.config.headers
    if (headers && !res.writableEnded) {
        if (isObject(headers)) {
            Object.keys(headers).forEach(v => {
                res.setHeader(v, headers[v])
            })
        }
    }
}

module.exports = { deploy, setHeader }