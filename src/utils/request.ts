/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request'
import { message } from 'antd'
import { BASE_URL } from '@/utils/utils'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

/**
 * 异常处理程序
 */
const errorHandler = (error: {
  response: Response
  message?: string
}): Response => {
  const { response } = error
  let msg = error.message || '未知错误'
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status } = response
    msg = errorText
    if (status === 419) {
      msg = '请您重新登陆'
      window.location.href = '/#/419'
      // throw new Error(errorText);
    }
  }
  if (msg === '请您重新登陆') {
    window.location.href = '/#/419'
  } else {
    message.error(msg)
    throw new Error(msg)
  }
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // prefix: '/php',
  errorHandler, // 默认错误处理
  // headers: {
  //   'X-CSRF-TOKEN': token,
  // },
  credentials: 'include' // 默认请求是否带上cookie
})

let getToken

request.use(async (ctx, next) => {
  const { req } = ctx
  const { headers = {} } = req.options
  headers['X-CSRF-TOKEN'] =
    headers['X-CSRF-TOKEN'] ||
    (req.url === `${BASE_URL}/` ? undefined : await getToken())
  req.options.headers = headers
  await next()
})

getToken = async () => {
  const token = sessionStorage.getItem('token')
  if (token) return token
  const data = await request(`${BASE_URL}/`, {
    responseType: 'text',
    method: 'GET'
  })
  if (/name="?token"?\s*content="?([^>\s"]+)"?/.test(data)) {
    const originToken = RegExp.$1
    sessionStorage.setItem('token', originToken)
    return token
  }
  return ''
}

request.interceptors.response.use(async (response, options) => {
  const { responseType: type = 'json' } = options
  if (type === 'json') {
    try {
      const data = await response.clone().json()
      const { errcode = 0, message: info } = data || {}
      if (errcode === 0) return response
      if (errcode === 1) {
        sessionStorage.removeItem('token')
        return response
      }
      const msg = info
      throw new Error(msg)
    } catch (error) {
      if (error.message.indexOf('Unexpected') === -1) {
        message.error(error.message || '操作异常')
      }
    }
  }
  return response
})

export default request
