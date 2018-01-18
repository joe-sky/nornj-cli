import { types } from "mobx-state-tree";
import { observable, toJS } from 'mobx';
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import Notification from '../../utils/notification';

const #{pageName | pascal}#Store = types.model("#{pageName | pascal}#Store", {
    bool: types.optional(types.boolean, true), // 布尔类型声明
    strs: types.optional(types.string, ''), // 字符串类型声明
    arrs: types.optional(types.array(types.string), []), // 数组类型声明
  })
  .volatile(self => ({
    modData: null,
  }))
  .views(self => {
    return {
      //
    };
  })
  .actions(self => {
    return {
      afterCreate() {

      },

      getModData(params) {
        return fetchData(`${__HOST}/#{pageName}#/getModData`,
          self.setModData,
          params, { method: 'get' }).catch((ex) => {
          Notification.error({
            description: '获取数据异常:' + ex,
            duration: null
          });
        });
      },

      setModData(result) {
        if (result.success) {
          self.modData = result.data;
        } else {
          Notification.error({
            description: '获取数据错误:' + result.message,
            duration: null
          });
        }
      },

    };
  });

export default #{pageName | pascal}#Store;
