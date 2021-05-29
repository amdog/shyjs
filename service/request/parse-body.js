const querystring = require('querystring')
const { isObject } = require('../../lib/kit.js')
async function parseBody(req) {
    if (req.method == 'POST') {
        let data = ''
        let size = 0
        req.on('data', (chunk) => {
            size += chunk.length
            data += (chunk)
        })

        return new Promise(res => {
            req.on('end', () => {
                if (req.headers['content-type'].indexOf('application/json') >= 0) {
                    res(JSON.parse(JSON.stringify(data.replace('\n', ''))))
                } else {
                    if (size > 16000) {
                        res(data)
                    } else {
                        let result
                        try {
                            result = JSON.parse(JSON.stringify(data.replace('\n', '')))
                            if (!isObject(result)) throw new Error('not object')
                        } catch (e) {
                            if (e) {
                                try {
                                    result = querystring.parse(data)
                                    if (!isObject(result)) throw new Error('not object')
                                } catch (e) {
                                    if (e) {
                                        result = data
                                    }
                                }
                            }
                        }
                        res(result)
                    }
                }
            })
        })

    }
}
module.exports = { parseBody }