import { types } from 'mobx-state-tree';
import { observable, toJS, action } from 'mobx';
import axios from 'axios';
import Notification from '../../utils/notification';

const EmptyExampleStore = types
  .model('EmptyExampleStore', {
    bool: types.optional(types.boolean, true),
    strs: types.optional(types.string, ''),
    arrs: types.optional(types.array(types.string), []),
  })
  .volatile(self => ({
    modData: null,
  }))
  .views(self => ({}))
  .actions(_self => {
    const self = _self as typeof EmptyExampleStore.Type;
    return {
      afterCreate() {},
  
      getModData(params: object) {
        return axios.get(`${__HOST}/emptyExample/getModData`, {
          params
        })
          .then(self.setModData)
          .catch((ex) => {
            Notification.error({
              message: '获取数据异常:' + ex,
              duration: null
            });
          });
      },
  
      setModData({ data: result }: ServiceResponse) {
        if (result.success) {
          self.modData = result.data;
        } else {
          Notification.error({
            message: '获取数据错误:' + result.message,
            duration: null
          });
        }
      }
    };
  });

export default EmptyExampleStore;
