var path = require('path')
var fs = require('fs')
var Router = require('koa-router')
var userModel = require('../model/users.js')
var md5 = require('md5')
var moment = require('moment')
var log = new require('../public/log.js')()

var router = new Router({
  prefix: '/updateUser'
})

router
  .get('/', async ctx => {
    let userInfo = await userModel.findUserBySourceId(ctx.session.userInfo.sourceId).then(data => {
      if (data.length) {
        console.log(data)
        delete data[0].password
        return data[0]
      } else {
        return null
      }
    })
    return ctx.render('updateUserInfo', {
      userInfo: userInfo
    })
  })
  .post('/userInfo', async ctx => {
    let userInfo = ctx.request.body
    userInfo.updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    if (ctx.session.userInfo.source === 'native') {
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

        if ((['1', '2', '3'].indexOf(ctx.request.body.gender)) === -1) {
          throw new Error('请选择正确的性别')
        }

        let base64Data = ctx.request.body.avatar.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64')
        let avatarName = `${moment().format('YYYY-MM-DD-HH-mm-ss-SS')}.png`
        let uploadAvatar = await new Promise((resolve, reject) => {
          fs.writeFile(path.join(__dirname, `../static/img/${avatarName}`), dataBuffer, err => {
            if (err) {
              throw new Error(err);
              reject(false)
            }
            resolve(true)
          })
        })

        if (uploadAvatar) {
          userInfo.avatar = avatarName
        } else {
          throw new Error('图片上传失败，请重试');
        }

      } catch (e) {
        ctx.body = {
          code: -1,
          data: {},
          msg: e.message
        }
        return 0
      }
    }

    userInfo.gender = parseInt(userInfo.gender)
    userInfo.password = md5(userInfo.password)
    userInfo.sourceId = ctx.session.userInfo.sourceId
    console.log(userInfo, ctx.session.userInfo.source)
    let update = userModel.updateUserInfoById(userInfo, ctx.session.userInfo.source).then(data => {
      return data ? true : false
    }).catch(err => {
      log.error('用户信息更新失败', JSON.stringify(err))
    })
    ctx.body = {
      code: update ? 1 : -1,
      data: {},
      msg: update ? '信息更新成功' : '信息更新失败，请尝试重试或联系客服'
    }
  })

module.exports = router.routes()
