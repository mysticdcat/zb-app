/**
 * axios 配置
 */

import axios from 'axios'
import env from '~/env'

const http = axios.create({baseURL: env.apiURL}) // 配置基础请求网址
http.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//   var key = localStorage.getItem('key');
//   key = key.replace('+', "%2B");
//   key = key.replace('=', '%3D')
// http.defaults.params = {key:key}
export default http