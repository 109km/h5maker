
let BACKEND_DOMAIN = 'http://localhost:3333'
if (process.env.NODE_ENV === 'production') {
  // 生产环境
  BACKEND_DOMAIN = 'http://node.bluemoon.com.cn'
} else if (process.env.NODE_ENV === 'development') {
  // 本地开发
  BACKEND_DOMAIN = 'http://localhost:3333'
} else if (process.env.NODE_ENV === 'test') {
  // 部署测试服务器
  BACKEND_DOMAIN = 'http://192.168.241.20:3000'
}
export default {
  BACKEND_DOMAIN
}
