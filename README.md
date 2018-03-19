## blog应用
项目启动前，请先根据 `./config/default.js` 中的配置创建对应mysql链接以及数据库，数据库服务为 mysql ，项目仍在开发迭代阶段，会根据个人时间持续更新...

## 技术栈
##### 后端
- 语言为 node、web框架为 koa、数据库语言为 mysql
- 所有插件一般为koa的中间件，部分为个人编写的，后续功能完成后会添加调试相关配置及环境配置

##### 前端
- 前端暂时为 ejs 构造的模板页，待功能暂时开发完成后可能会选择其他前端框架重构 ng、vue、react 都有可能

## 功能设计
##### 有删除线代表有设计但未完成的功能，后续仍有可能迭代新功能
1.  用户模块
  - 用户登录
  - 注册用户
  - 注销用户
  - github第三方用户接入(此功能需要添加 ./config/default.js 下的 github app's client id 与 client secret,，不会的朋友可以查看我这篇博客 [如何进行 github 第三方用户授权](http://blog.csdn.net/yolo0927/article/details/79315824) 文章学习，若不需要该功能，请删除对应业务代码)
  - ~~用户信息更新~~
2.  文章模块
  - ~~创建发表文章~~
  - ~~修改文章内容~~
  - ~~删除文章~~
  - ~~按标签分类文章~~
3.  用户留言模块
  - ~~创建留言~~
  - ~~删除留言~~
4.  其他
  - ~~博客迁移(暂定为简书和csdn)~~
