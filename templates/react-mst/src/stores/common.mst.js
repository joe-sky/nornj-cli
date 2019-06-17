import { types } from 'mobx-state-tree';
import BaseStore from './base.mst';
import * as api from '../services/common';
import Notification from '../utils/notification';

export const UserInfo = types.model('UserInfo', {
  pin: types.maybe(types.string),
  name: types.maybe(types.string)
});

export default BaseStore.named('CommonStore')
  .props({
    userInfo: types.maybe(UserInfo)
  })
  .views(self => ({}))
  .actions(self => ({
    getCurrentUserInfo() {
      return api.getCurrentUserInfo().then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            self.userInfo = res.data.data;
          }
          return res;
        })
      );
    }
  }));
