import axios from '@/utils/axios';

export async function getModData(params) {
  return axios({
    url: 'formExample/getModData',
    method: 'get',
    params,
    errorTitle: '获取数据'
  });
}
