const crypto = require('crypto')
let SessionStore = {}

function storeClock() {
    let configSession = global.config.session
    if (configSession && configSession.store) {
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
    let configSession = global.config.session
    if (configSession) {
        let session = {
            set: (key) => {
                let hash = crypto.createHash('md5')
                hash.update(key)
                let k = hash.digest('hex')
                hinge.setCookie(configSession.cookieKey, k, configSession)
                hinge.res.setHeader('Authorization', k)
                if (configSession.store) {
                    configSession.store.set(k, key)
                    configSession.store.expire(k, configSession.maxAge)
                    return true
                } else {
                    SessionStore[k] = [key, configSession.maxAge]
                }
            },
            get(key) {
                if (configSession.store) {
                    return configSession.store.get(key)
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
                let sign_id = hinge.cookie[configSession.cookieKey]
                if (configSession.store) {
                    return configSession.store.del(sign_id)
                } else {
                    delete SessionStore[key]
                }
                hinge.setCookie(configSession.cookieKey, sign_id, {
                    expires: 'expires=Thu, 02-Sep-2021 04:45:13 GMT',
                    maxAge: '0'
                })
            }
        }
        let key = configSession.cookieKey


        if (!hinge.cookie[key]) {
            key = hinge.headers['authorization']
            if (key) {
                session[key] = key
                session.value = await session.get(key)
            }
        } else {
            session[key] = hinge.cookie[key]
            session.value = await session.get(session[key])
        }
        return session
    } else {
        return {}
    }
}

module.exports = { parseSession, SessionStore, storeClock }