import axios from '../../utils/axios';

export async function getModData(params) {
  return axios({
    url: 'emptyExample/getModData',
    method: 'get',
    params,
    errorTitle: '获取数据'
  });
}
