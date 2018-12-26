## blog应用
项目启动前，请先根据 `./config/default.js` 中的配置创建对应mysql链接以及数据库，数据库服务为 mysql ，项目已暂时停止更新，后续看心情是否优化或迭代～

## 技术栈
##### 后端
- 语言为 node、web框架为 koa、数据库语言为 mysql
- 所有插件一般为koa的中间件，部分为个人编写的，后续功能完成后会添加调试相关配置及环境配置
- 使用 jenkins 部署

**注意： 由于本项目现在换由 jenkins 部署构建后，每次 jenkins 部署镜像更新时，会将原本存在项目目录下的图片覆盖更新，所以现在会导致每次更新后图片就消失了，将用户上传的图片存至第三方对象存储或非项目目录下可解决本问题，如 又拍云、七牛云，预览地址也由于这个原因，之前用户的相关图片已经清空，这是我个人的失误，后续有时间我会将上传地址改为上述其中一个对象存储。**


##### 前端
- 前端暂时为 ejs 构造的模板页，待功能暂时开发完成后可能会选择其他前端框架重构 ng、vue、react 都有可能

## 功能设计
##### 有删除线代表有设计但未完成的功能，后续仍有可能迭代新功能
1.  用户模块
  - 用户登录
  - 注册用户(后续会将用户头像存入七牛云)
  - 注销用户
  - github第三方用户接入(此功能需要添加 ./config/default.js 下的 github app's client id 与 client secret,，不会的朋友可以查看我这篇博客 [如何进行 github 第三方用户授权](http://blog.csdn.net/yolo0927/article/details/79315824) 文章学习，若不需要该功能，请删除对应业务代码)
  - 用户信息更新(github 授权登录用户将不能更改用户名、头像及密码等 github 相关授权信息，每次授权会自动同步，其他如性别等通用信息可照常更改)
2.  文章模块
  - 创建发表文章
  - 主页文章广场
  - 修改文章内容
  - 删除文章
  - 文章点赞
  - ~~我的文章中添加最近留言板块~~
  - ~~按标签分类文章~~
  - ~~站内搜索~~
3.  用户留言模块
  - 创建留言
  - 删除留言
  - 回复留言
4.  其他
  - ~~博客迁移(暂定为简书和csdn)~~
  - ~~用户通知~~

## 最后
如果有好的想法及需求可以在 issue 中提出，代码仍在迭代，我会在完成基本功能后再进行代码的优化与通用函数的抽离，所以目前代码还比较凌乱，还请谅解。

## 预览地址
http://www.freewrite.cn
