import axios from 'axios';
import Notification from '../utils/notification';

export const axiosInstance = axios.create({
  baseURL: `${__HOST}/`
});
axiosInstance.defaults.timeout = 30000;
axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axiosInstance.interceptors.response.use(
  res => {
    if (res.status !== 200) {
      Notification.error({
        message: '请求失败'
      });
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    if (n`${error}.response.status == 401`) {
      Notification.error({
        message: '登录状态失效，请重新登录！',
        duration: null,
        onClose: () => {
          //window.location.href = process.env.APP_SSO_URL + window.location.href;
        }
      });
    } else {
      Notification.error({
        message: n`${error}.response.data.errorTitle + '异常：' + ${error}.response.data.message`
      });
      return Promise.reject(error);
    }
  }
);

export default function(config) {
  if (n`${config}.errorTitle`) {
    if (!config.transformResponse) {
      config.transformResponse = [];
    }
    config.transformResponse.push(data => ({ ...JSON.parse(data), errorTitle: config.errorTitle }));
  }

  return axiosInstance(config);
}
