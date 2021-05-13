const querystring = require('querystring')

async function parseBody(req) {
    if (req.method == 'POST') {
        let arry = []
        let size = 0
        req.on('data', (chunk) => {
            if (req.headers['content-type'] == 'application/json' || req.headers['content-type'] == 'application/x-www-form-urlencoded') {
                size += chunk.length
                arry.push(chunk)
            }
        })
        return new Promise(res => {
            req.on('end', () => {
                if (req.headers['content-type'].indexOf('application/json') >= 0) {
                    res(JSON.parse(JSON.stringify(data.replace('\n', ''))))
                } else {
                    let buff = Buffer.concat(arry, size)
                    if (req.headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0) {
                        if (size > 8000) {
                            res(buff)
                        } else {
                            res(querystring.parse(buff.toString()))
                        }
                    } else {
                        res(buff)
                    }
                }
            })
        })

    }
}
module.exports = { parseBody }