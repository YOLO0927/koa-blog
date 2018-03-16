var path = require('path')
var Router = require('koa-router')
var userModel = require('../model/users.js')
var md5 = require('md5')
var log = new require('../public/log.js')()

var router = new Router({
  prefix: '/signin'
})

router
  .get('/', async ctx => {
    if (ctx.session.userInfo) {
      ctx.response.redirect('/')
    } else {
      ctx.state.app.status = ctx.session.status
      ctx.state.app.msg = ctx.session.msg
      return ctx.render('signin')
    }
  })
  .post('/', async ctx => {
    await userModel.findUserByName(ctx.request.body.username).then(async data => {
      if (data[0]['username'] === ctx.request.body.username && data[0]['password'] === md5(ctx.request.body.password)) {
        delete data[0]['password']
        ctx.session.userInfo = data[0]
        ctx.session.msg = `登录成功，欢迎您${data[0]['username']}`
        ctx.session.status = 1
        ctx.response.redirect('/')
      } else {
        ctx.session.status = 2
        ctx.session.msg = '用户名或密码不正确'
        ctx.response.redirect('/signin')
      }
    })
  })
  .get('/logout', async ctx => {
    ctx.session.status = 1
    ctx.session.msg = `已注销用户${ctx.session.userInfo.username}`
    ctx.session.userInfo = null
    ctx.response.redirect('/signin')
  })

module.exports = router.routes()
