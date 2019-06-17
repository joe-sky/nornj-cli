import axios from '../utils/axios';

export async function getCurrentUserInfo() {
  return axios({
    url: 'common/getCurrentUserInfo',
    method: 'post',
    errorTitle: '获取用户信息'
  });
}
