import { types, detach } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../utils/notification';
import moment from 'moment';
import { toJS } from 'mobx'

const {%storeName%}Store = types.model("{%storeName%}Store", {
  selectedBrand: types.optional(types.number, () => 0)
}, {
  getCategoryData(params) {
    return fetchData(
        `${__HOST}/common/getCategoryData`,
        this.setCategoryData,
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品类数据异常:' + ex, duration: null });
      });
  },
  setCategoryData(result) {
    if (result.success) {
      const data = result.data;
      this.categoryData = data;
    } else {
      Notification.error({ description: '获取品类数据异常:' + result.message, duration: null });
    }
  },
});

export default {%storeName%}Store;