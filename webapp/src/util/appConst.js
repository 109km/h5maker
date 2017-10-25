import config from '../../config'

let BACKEND_DOMAIN = 'http://localhost' + (config.dev.back_end_port ? ':' + config.dev.back_end_port : '')
if (process.env.NODE_ENV === 'production') {
  BACKEND_DOMAIN = 'http://h5.limesoftware.cn'
} else if (process.env.NODE_ENV === 'development') {
  BACKEND_DOMAIN = 'http://localhost' + (config.dev.back_end_port ? ':' + config.dev.back_end_port : '')
}
export default {
  BACKEND_DOMAIN
}
