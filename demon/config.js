module.exports = {
    logDir: './', //日志保存目录
    static: 'public', //静态资源目录
    port: 80,
    cacheLog: 10, //日志缓存条数

    mysql: { //mysql配置
        host: 'localhost',
        user: 'root',
        password: '123',
        database: 'customer'
    },


    headers: { //例如跨域请求头
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Origin,Accept,X-Requested-With',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS.PUT,PATCH,DELETE'
    },


    redis: {}, //redis配置
    session: { //session配置

        cookieKey: 'sig_id', //保存session id的键名
        maxAge: 1000 * 60 * 60, //session 存活时间
        path: '/', //cookie生效路径
        httpOnly: true,

        /*         store: { //cookie的保存方法 default保存在内存中 但是这样容易内存泄漏
                    set(key,value) {
                        console.log('set');
                    },
                    get(key) {
                        console.log('get')
                    },
                    expire(key,time) {
                        console.log('expire');
                    }
                } */

    }
}