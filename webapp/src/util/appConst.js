
let BACKEND_DOMAIN = 'http://localhost:3000'
if (process.env.NODE_ENV === 'production') {
  BACKEND_DOMAIN = 'http://node.bluemoon.com.cn'
} else if (process.env.NODE_ENV === 'development') {
  BACKEND_DOMAIN = 'http://localhost:3000'
}
export default {
  BACKEND_DOMAIN
}
