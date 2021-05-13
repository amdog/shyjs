const crypto = require('crypto')
let SessionStore = {}

function storeClock() {
    if (global.config.session && global.config.session.store) {
        setInterval(() => {
            for (let key in SessionStore) {
                SessionStore[key][1] -= 1000
                if (SessionStore[key][1] < 0) {
                    delete SessionStore[key]
                }
            }
        }, 1000)
    }
}


async function parseSession(hinge) {
    if (global.config.session) {
        let session = {
            set: (key) => {
                let hash = crypto.createHash('md5')
                hash.update(key)
                let k = hash.digest('hex')
                hinge.setCookie(global.config.session.cookieKey, k, global.config.session)
                if (global.config.session.store) {
                    global.config.session.store.set(k, key)
                    global.config.session.store.expire(k, global.config.session.maxAge)
                    return true
                } else {
                    SessionStore[k] = [key, global.config.session.maxAge]
                }
            },
            get(key) {
                if (global.config.session.store) {
                    return global.config.session.store.get(key)
                } else {
                    let result = null
                    if (SessionStore[key]) {
                        result = SessionStore[key][0]
                        return new Promise(res => {
                            res(result)
                        })
                    }
                }
            },
            del() {
                let sign_id = hinge.cookie[global.config.session.cookieKey]
                if (global.config.session.store) {
                    return global.config.session.store.del(sign_id)
                } else {
                    delete SessionStore[key]
                }
                hinge.setCookie(global.config.session.cookieKey, sign_id, {
                    expires: 'expires=Thu, 02-Sep-2021 04:45:13 GMT',
                    maxAge: '0'
                })
            }
        }
        let key = global.config.session.cookieKey
        if (hinge.cookie[key]) {
            session[key] = hinge.cookie[key]
            session.value = await session.get(session[key])
        }
        return session
    } else {
        return {}
    }
}

module.exports = { parseSession, SessionStore, storeClock }