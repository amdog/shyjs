class Redis {
    constructor(R) {
        this.conf = {}
        if (global.config && global.config.redis) {
            this.conf = global.config.redis
        }
        this.R = R.createClient(this.conf)
    }
    expire(key, age) {
        this.R.expire(key, age)
    }
    get(key) {
        return new Promise((res) => {
            this.R.get(key, (e, v) => {
                res(v)
            })
        })
    }
    set(...args) {
        this.R.set(args[0], args[1], (e) => {
            if (e) {
                console.log(e);
            }
        })
    }

    del(key) {
        this.R.del(key, (e) => {})
    }
}
class Mysql {
    constructor(M) {
        this.M = M
    }
    async select(table, condition) {
        let keys = Object.keys(condition)
        if (typeof condition == 'string') {
            if (condition == '*') {
                return await this.query(`select * from ${table}`)
            } else {
                return await this.query(`select * from ${table} where ${condition}`)
            }
        } else {
            if (keys.length == 1) {
                return await this.query(`select * from ${table} where ${keys[0]}='${condition[keys[0]]}'`)
            } else {
                return await this.query(`select * from ${table} where ${keys[0]}='${condition[keys[0]]}' and ${keys[1]}='${condition[keys[1]]}'`)
            }
        }
    }

    async existTb(name) {
        if (await this.query(`show tables like '${name}'`)) {
            return true
        }
        return false
    }

    async createTb(name, desc) {
        if (await this.existTb(name)) {
            return new Error(' the table exist!')
        } else {
            let sql = `create table ${name}(`
            for (let key in desc) {
                sql += `${key} ${desc[key]},`
            }
            return this.query(`${sql.substring(0, sql.length - 1)}) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
        }
    }

    async dropTb(name) {
        if (await this.existTb(name)) {
            return this.query(`drop table ${name}`)
        }
    }

    async update(table, condition1, condition2) {
        let key1 = Object.keys(condition1)[0]
        let value1 = condition1[key1]

        let key2 = Object.keys(condition2)[0]
        let value2 = condition2[key2]

        let key3 = Object.keys(condition2)[1]
        let value3 = condition2[key3]
        let r
        if (key3) {
            r = await this.query(`update ${table} set ${key1}='${value1}'  where ${key2}='${value2}' and ${key3}='${value3}'`)
        } else {
            r = await this.query(`update ${table} set ${key1}='${value1}'  where ${key2}='${value2}'`)
        }
        return !!r
    }
    async delete(table, condition) {
        let key = Object.keys(condition)[0]
        let value = condition[key]
        let r = await this.query(`delete from ${table}  where ${key}='${value}'`)
        return !!r
    }
    async descTb(name) {
        return this.query(`desc ${name}`)
    }
    async insert(table, condition) {
        let values = ''
        let keys = ''
        let keyArry = Object.keys(condition)
        keyArry.forEach((v, i) => {
            if (i == keyArry.length - 1) {
                keys += v
                values += `'${condition[v]}'`
            } else {
                keys += `${v},`
                values += `'${condition[v]}',`
            }

        })
        await this.query('set names utf8')
        let r = await this.query(`insert into ${table}(${keys}) values (${values})`)
        return !!r
    }
    query(sql) {
        let connection = this.M.createConnection(global.config.mysql)
        connection.connect()
        return new Promise((rs) => {
            connection.query(sql, (e, r) => {
                if (e) {
                    throw e
                }
                connection.end()
                if (r && !r[0]) {
                    rs(null)
                } else {
                    rs(Array.from(r))
                }
            })
        })
    }
}


class ArtTemplate {
    constructor(A) {
        this.A = A
        this.template = A
        this.render = A.render
        this.compile = A.compile
        if (global.config.artTemplate) {
            this.A.default = global.config.artTemplate
        }
    }
}


let PlugList = {
    "mysql": Mysql,
    "redis": Redis,
    "art-template": ArtTemplate
}

class Plug {
    constructor(...args) {
        args.forEach(v => {
            this[v.split('-')[0]] = new PlugList[v](loadLib(v))
        })
    }
}
module.exports = { Plug }

function loadLib(name) {
    try {
        return require(name)
    } catch (e) {
        console.log('\x1B[33m%s\x1b[0m', `\n npm i ${name} -s`);
    }
}