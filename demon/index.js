 /*
                                                            node(服务端的JavaScript) 服务器软件
                                                            shyjs 在node上建立的框架 例如 ruby 的ruby on rails java平台的springboot
                                                            1 可以零配置零依赖
                                                            2 将所有数据尽可能全处理好 供开发者调用
                                                            3 封装了mysql的接口 自动模板渲染
                                                            */
 const shy = require('shyjs')

 const config = require('./config.js')
 config.session.store = new shy.Plug('redis').redis

 shy.deploy(config)

 shy.beforeNext = function(next) {
     if (this.url.origin == '/login' || this.session.value) {
         next()
     } else {
         this.redirect('/')
     }
 }

 class C extends shy.Plug {
     constructor() {
         //插件的引入
         super('mysql', 'art-template')
     }
     async login(q) {

         let message = ''
         let name = this.data.nam
         let password = this.data.pwd
             //简单的查询
         if (await this.mysql.select('user', { name: name, password: password })) {
             //设置session
             //如果设置cookie this.setCookie('who_login',name,{maxAge: 1000 * 60 * 60, path: '/', httpOnly: true})
             this.session.set(name)
             this.redirect('/about.html')
         } else {
             message = { mes: '账号或者密码错误!' }
         }
         return message

     }

     async about(q) {
         n
         let name = this.session.value
         if (name) {
             let goods
             if (q.limit) {
                 //对于复杂的sql语句 可以直接使用query方法 写sql
                 goods = await this.mysql.query(`select * from tb_goods limit ${q.limit}`)
             } else {
                 goods = await this.mysql.select('tb_goods', '*')
             }
             return { name: name, goods: goods }
         } else {
             this.redirect('/')
             return ''
         }
     }

     async add(q) {
         await this.mysql.insert('tb_goods', { goods: this.data.goods, city: this.data.city, postal: this.data.postal })
         this.redirect('/about.html')
         return { message: 'ok' }
     }

     exit(q) {
         this.session.del()
         this.redirect('/')
     }
     async del(q) {
         if (q.id) {
             await this.mysql.delete('tb_goods', { id: q.id })
             this.redirect('/about.html')
         }
     }
 }
 shy.Controller = new C()
     //路由 匹配

 shy.Route.post('/login', shy.Controller.login)
 shy.Route.get('/exit', shy.Controller.exit)
 shy.Route.post('/add', shy.Controller.add)
 shy.Route.get('/del', shy.Controller.del)

 //视图渲染 当控制器有对应路由并且静态服务文件夹有请求文件
 // <% name %>

 shy.Route.get('/about', shy.Controller.about)
     /*
     1 服务配置
     2 路由匹配
     3 工具函数
     4 mysql api封装
     5 模板渲染
     6 日志记录 
     7 前端报错

     */