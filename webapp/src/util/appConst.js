import config from '../../config'

let BACKEND_DOMAIN = 'http://localhost' + (config.dev.back_end_port ? ':' + config.dev.back_end_port : '')
if (process.env.NODE_ENV === 'production') {
  // 生产环境
  BACKEND_DOMAIN = 'http://node.bluemoon.com.cn'
} else if (process.env.NODE_ENV === 'development') {
  // 本地开发
  BACKEND_DOMAIN = 'http://localhost' + (config.dev.back_end_port ? ':' + config.dev.back_end_port : '')
} else if (process.env.NODE_ENV === 'test') {
  // 部署测试服务器
  BACKEND_DOMAIN = 'http://192.168.241.20:3000'
}
export default {
  BACKEND_DOMAIN
}
