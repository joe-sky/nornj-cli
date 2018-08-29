import { types } from 'mobx-state-tree';
import { observable, toJS } from 'mobx';
import axios from 'axios';
import Notification from '../../utils/notification';

const SimpleExampleStore = types
  .model('SimpleExampleStore', {
    bool: types.optional(types.boolean, true), // 布尔类型声明
    strs: types.optional(types.string, ''), // 字符串类型声明
    arrs: types.optional(types.array(types.string), []), // 数组类型声明
  })
  .volatile(self => ({
    modData: null,
  }))
  .views(self => ({

  }))
  .actions(self => ({
    afterCreate() {

    },

    getModData(params) {
      return axios.get(`${__HOST}/simpleExample/getModData`, {
        params
      })
        .then(self.setModData)
        .catch((ex) => {
          Notification.error({
            description: '获取数据异常:' + ex,
            duration: null
          });
        });
    },

    setModData({ data: result }) {
      if (result.success) {
        self.modData = result.data;
      } else {
        Notification.error({
          description: '获取数据错误:' + result.message,
          duration: null
        });
      }
    }
  }));

export default SimpleExampleStore;
