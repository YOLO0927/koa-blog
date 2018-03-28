var moment = require('moment')
var Router = require('koa-router')
var articleModel = require('../model/articles')
var saveBase64 = require('../public/saveBase64').save
var log = new require('../public/log.js')()

var router = new Router({
  prefix: '/article'
})

router
  .get('/create', async ctx => {
    // let userInfo = ctx.session.userInfo
    return ctx.render('create')
  })
  .post('/addArticles', async ctx => {
    try {
      if (!ctx.request.body.content) {
        throw new Error('文章内容不能为空')
      }
      if (!ctx.request.body.title) {
        throw new Error('文章标题不能为空')
      }
      if (!ctx.request.body.content) {
        throw new Error('文章类型不能为空')
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        data: {},
        msg: e.message
      }
    }

    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    let picture = await saveBase64(ctx.request.body.picture).then(imgName => {
      return imgName
    })
    let args = [
      ctx.request.body.title,
      ctx.request.body.tag || null,
      ctx.request.body.abstract || null,
      ctx.request.body.content,
      ctx.request.body.type,
      ctx.session.userInfo.sourceId,
      picture || null,
      1,
      time,
      time
    ]
    let createSuccess = await articleModel.addArticles(args).then(data => {
      ctx.body = {
        code: data ? 1 : -1,
        data: {},
        msg: data ? '创建文章成功' : '创建文章失败，请重试'
      }
    }).catch(err => {
      log.error('创建文章失败', JSON.stringify(err))
      return false
    })
  })
  .get('/:id', async ctx => {
    let articleData = await articleModel.findArticlesById(ctx.params.id).then(data => {
      if (data.length) {
        return data[0]
      }
    }).catch(err => {
      log.error('查询文章错误', JSON.stringify(err))
    })
    return ctx.render('article', {
      article: Object.assign({}, articleData, {update_time: moment(articleData.update_time).format('YYYY-MM-DD HH-mm')})
    })
  })

module.exports = router.routes()
