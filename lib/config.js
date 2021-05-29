function defaultConf(conf) {
    let config = conf
    config.version = '2.1.2'
    config.port = conf.port ? conf.port : 9187;
    config.timeOut = conf.timeOut ? conf.timeOut : 3000;
    config.static = conf.static ? conf.static : false
    config.logDir = conf.logDir ? conf.logDir : false
    config.cacheLog = conf.cacheLog ? conf.cacheLog : 6;
    config.headers = conf.headers ? conf.headers : false;
    config.mysql = conf.mysql ? conf.mysql : false;
    config.redis = conf.redis ? conf.redis : {};
    config.session = conf.session ? conf.session : {}
    config.session.cookieKey = config.session.cookieKey ? conf.session.cookieKey : 'sign_id'
    config.mode = process.argv[2] == '--dev' ? 'development' : 'product'
    return config
}
module.exports = { defaultConf }