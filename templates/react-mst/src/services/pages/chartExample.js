import axios from '../../utils/axios';

export async function getSummaryData() {
  return axios({
    url: 'chartExample/getSummaryData',
    method: 'get',
    errorTitle: '获取Summary数据'
  });
}

export async function getGrowthData(params) {
  return axios({
    url: 'chartExample/growthData',
    method: 'get',
    params,
    errorTitle: '获取Growth数据'
  });
}

export async function getSubCategoryData(params) {
  return axios({
    url: 'chartExample/getSubCategoryData',
    method: 'get',
    params,
    errorTitle: '获取SubCategory数据'
  });
}

export async function getBarSubCategoryData(params) {
  return axios({
    url: 'chartExample/getBarSubCategoryData',
    method: 'get',
    params,
    errorTitle: '获取BarSubCategory数据'
  });
}

export async function getTableSubCategoryData(params) {
  return axios({
    url: 'chartExample/getTableSubCategoryData',
    method: 'get',
    params,
    errorTitle: '获取TableSubCategory数据'
  });
}

export async function getBrandCompareList(params) {
  return axios({
    url: 'chartExample/getBrandCompareList',
    method: 'get',
    params,
    errorTitle: '获取BrandCompare数据'
  });
}

export async function getBrandCompareItemForCategory(params) {
  return axios({
    url: 'chartExample/getBrandCompareItemForCategory',
    method: 'get',
    params,
    errorTitle: '获取BrandCompareItemForCategory数据'
  });
}
