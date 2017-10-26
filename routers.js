var errors = require('./components/errors')
var apiUser = require('./api/user')
var apiPages = require('./api/pages')
var apiFile = require('./api/file')
var apiAuth = require('./auth')

module.exports = function (app) {
  app.use('/api/users', require('./api/user'))
  app.use('/api/pages', require('./api/pages'))
  app.use('/api/form', require('./api/form'))
  app.use('/api/upload', require('./api/file'))
  app.use('/api/submit', require('./api/submit'))
  app.use('/api/proxy/region', require('./api/proxy'))
  app.use('/api/checkAnswer', require('./api/statisticalanalysis'))
  app.use('/api/downloadExcel', require('./api/statisticalanalysis'))
  app.use('/auth', require('./auth'))
    // 用户权限相关
    app.use('/auth', apiAuth)
    .get(errors[404])

    // 404错误处理
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // 预览路由
    app.route('/perview/:id').get(require('./render/preview'))

  // 其他资源路由
  app.route('/*')
    .get((req, res) => {
      res.render('index')
    })
}
