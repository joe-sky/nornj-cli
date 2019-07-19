import { types, flow } from 'mobx-state-tree';
import * as api from '@/services/common';
import { notification } from 'antd';

export const UserInfo = types.model('UserInfo', {
  pin: types.maybe(types.string),
  name: types.maybe(types.string)
});

export default types
  .model('CommonStore', {
    userInfo: types.maybe(UserInfo)
  })
  .views(self => ({}))
  .actions(self => ({
    getCurrentUserInfo: flow(function*() {
      const res = yield api.getCurrentUserInfo();
      self.userInfo = res.data.data;
    })
  }));
