module.exports = {
    logDir: './', //日志保存目录
    static: 'public', //静态资源目录
    mysql: { //mysql配置
        host: 'localhost',
        user: 'root',
        password: '123',
        database: 'customer'
    },
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Origin,Accept,X-Requested-With',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS.PUT,PATCH,DELETE'
    },
    redis: {}, //redis配置
    session: { //session配置
        cookieKey: 'sig_id', //保存session id的键名
        maxAge: 1000, //session 存活时间
        path: '/', //cookie生效路径
        secure: true,
        httpOnly: true,
        /*         store: { //cookie的保存方法 default保存在内存中
                    set() {
                        console.log('set');
                    },
                    get() {
                        console.log('get')
                    },
                    expire() {
                        console.log('expire');
                    }
                } */
    }
}