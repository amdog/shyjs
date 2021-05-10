# shyjs 使用文档

- 安装

```bash
npm install shyjs --save
```

## 配置项(Config)

```javascript
const shy = require('shyjs')
shy.deploy({
  logDir: './', //日志保存目录
  static: './public', //静态资源目录
  cacheLog:8,//日志缓存数目
  mysql: {
    //mysql配置
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user',
  },
  //header:{} 自定义所有请求头
  redis: {}, //redis配置
  session: {
    //session配置
    cookieKey: 'sig_id', //保存session id的键名
    maxAge: 1000 * 60 * 60 * 24, //session 存活时间
    path: '/', //cookie生效路径
    secure: true,
    httpOnly: true,
    store: {
      //cookie的保存方法 default保存在内存中
      set() {
        console.log('set')
      },
      get() {
        console.log('get')
      },
      expire() {
        console.log('expire')
      },
    },
  },
})
```

## 路由规则(Route)

shyjs 支持 get post delete put 方法 每条请求根据请求路径和方法唯一对应一个控制器入口函数，并且完成调用，将返回值为响应内容返回客户端。

- 参数说明
  | url | contoller |
  | ---- | ---- |
  | string | function |
  | - | 必须是 shy.Controller 对象内的方法 |

```javascript
shy.Controller = {
  say() {
    return 'holle!'
  },
}
shy.Route.get('/say', shy.Controller.say) //浏览器输出 {data:'holle!'}
```

## 控制器(Controller)

- 控制器必须是一个对象
- 建议 Cotroller 使用标准写法:

```javascript
 class C {
    constructor() {

    }
    say(vector) {
        console.log(vector)
        return 'holle!'
    }
} }
shy.Controller = new C()
shy.Route.get('/say', shy.Controller.say)
```
 每一个控制器方法的第一个参数为请求和响应对象的摘要
- vector列表 
  | key |  |
  | ---- | ---- |
  | res | 原始res对象 |
  | req | 原始req对象 |
  | query | url参数解析 |
  | data | post数据对象 如果是文件则为buffer |
  | parseUrl | url路径解析 包括主机名 扩展名等 |
  | headers | 请求头 |
  | cookie | 请求的cookie列表对象 |
  | session | 见session说明 |
  | setCookie | 见cookie说明 |
  | saveAsFile | 将buffer保存为文件(\<string :path\>,\<buffer\>) |

## cookie
开发者可以通过 vector.seCookie(\<string :key\>,\<string :value\>,[options])

- options说明

  | key |  |
  | ---- | ---- |
  | maxAge | cookie存活时间 |
  | expires | cookie过期时间 |
  | path | cookie 生效路径 |
  | httpOnly | - |
  | secure | - |

## session

有关于session的配置 已经写在前面
有关vector.session 的解释
```javascript
  session: {
      // 此处的set 和 get在config.session.store 
      //使用config.session.store中配置set get方法 否则为默认方法 
    set: [Function: set], 
    get: [Function: get], 
    del: [Function: del], 
    sig_id: //客户端存活的cookie 即session id ,
    value: // 通过sesion id拿到的key 即get(sig_id)返回的结果
  },
```
另外，在config 配置中 session.store 必须包含 set get expire 方法
如果使用redis 则可以

```javascript
shy.deploy({
    config.session.store=new shy.Plug('redis')
})
```

## 日志(Log)
默认情况下shyjs不保存错误日志，当存在config.logDir 则日志记录规则为当发生错误信息(在执行控制器时候)将请求的路径、日期、堆栈报错信息保存到缓存区，并且记录到日志目录下的文件中。

## 插件(Plug)
支持mysql、redis、art-template插件 
例如mysql 插件使用如下
```javascript

class C extends shy.Plug {
    constructor() {
        super(['mysql', 'redis', 'art-template'])
    }
    async say(vector) {
        console.log(await this.mysql.select('info', { name: 'jack' }))
        console.log(await this.mysql.update('info', { name: 'jack' }, { password: 9 }))
        console.log(await this.mysql.insert('info', ['marry', 2, 'marry@qq.com']))
        console.log(await this.mysql.delete('info', { name: 'marry' }))    
        }
}
shy.Controller = new C()
shy.Route.get('/say', shy.Controller.say)

```
- beforeNext钩子
在进入controller之前 如果存在shy.beforeNext 则先执行beforeNext :(\<object :vector\>,callback) callback参数作为控制器的第二个参数。
！！！如果使用beforeNext 必须调用calback


create table tb_goods(id int auto_increment primary key,
goods char(60),
city char(40),
postal char(40),
)




