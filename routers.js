var errors = require('./components/errors')
var apiUser = require('./api/user')
var apiPages = require('./api/pages')
var apiFile = require('./api/file')
var apiAuth = require('./auth')

module.exports = function(app) {
    // 用户
    app.use('/api/users', apiUser);
    // 页面
    app.use('/api/pages', apiPages);
    // 文件上传
    app.use('/api/upload', apiFile);
    // 用户权限相关
    app.use('/auth', apiAuth)

    // 404错误处理
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // 预览路由
    app.route('/perview/:id').get(require('./render/preview'))

    // 其他资源
    app.route('/*')
        .get((req, res) => {
            res.render('index')
        });
}
