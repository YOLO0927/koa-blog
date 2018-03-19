var path = require('path')
var Router = require('koa-router')
var userModel = require('../model/users.js')
var md5 = require('md5')
var moment = require('moment')
var log = new require('../public/log.js')()

var router = new Router({
  prefix: '/signup'
})

router
  .get('/', async ctx => {
    console.log(ctx.session)
    ctx.state.app.status = ctx.session.status
    ctx.state.app.msg = ctx.session.msg
    return ctx.render('signup')
  })
  .post('/', async ctx => {
    try {
      if (!(ctx.request.body.username.length >= 1 && ctx.request.body.username.length <= 10)) {
        throw new Error('名字请限制在1-10个字符之间')
      }
      if (ctx.request.body.password.length < 6) {
        throw new Error('密码至少6个字符');
      }

      if (ctx.request.body.password !== ctx.request.body.repassword) {
        throw new Error('两次密码输入不一致')
      }

      if (['1', '2', '3'].indexOf(ctx.request.body.gender)) {
        throw new Error('请选择正确的性别')
      }

    } catch (e) {
      ctx.session.status = 2
      ctx.session.msg = e.message
      ctx.redirect('/signup')
    }
    await userModel.findUserByName(ctx.request.body.username).then(async data => {
      // 检测用户名是否存在
      if (data.length) {
        ctx.session.status = 2
        ctx.session.msg = '用户名已存在'
        ctx.redirect('/signup')
      } else {
        // 添加用户信息
        let avatar = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520854076839&di=15bd322420b8c4b16d39782425b42d89&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png'
        let isSuccess = await userModel.addUser([
          `native${(new Date()).getTime()}`,
          ctx.request.body.username,
          md5(ctx.request.body.password),
          parseInt(ctx.request.body.gender),
          avatar,
          ctx.request.body.sign,
          'native',
          moment().format('YYYY-MM-DD HH:mm:ss'),
          moment().format('YYYY-MM-DD HH:mm:ss')
        ]).then(result => {
          ctx.session.userInfo = ctx.request.body
          return true
        }).catch(err => {
          log.error('插入用户失败', JSON.stringify(err))
          return false
        })
        if(isSuccess) {
          ctx.session.status = 1
          ctx.session.msg = '注册成功'
          ctx.response.redirect('/')
        } else {
          ctx.session.status = 2
          ctx.session.errorMsg = '服务器错误，请重试'
          ctx.redirect('/signup')
        }
      }
    }).catch((err) => {
      log.error('查询用户信息错误', JSON.stringify(err))
    })
  })

module.exports = router.routes()
