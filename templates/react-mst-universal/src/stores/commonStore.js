import { types } from 'mobx-state-tree';
import axios from 'axios';
import Notification from '../utils/notification';

export const UserInfo = types.model('UserInfo', {
  pin: types.maybe(types.string),
  name: types.maybe(types.string),
});

export const CommonStore = types
  .model('CommonStore', {
    userInfo: types.maybe(UserInfo),
  })
  .views(self => ({
    get isDemo() {
      return self.userInfo.pin && self.userInfo.pin.trim().toLowerCase() === 'jd_653e751552511';
    }
  }))
  .actions(self => ({
    getCurrentUserInfo() {
      return axios.post(`${__HOST}/common/getCurrentUserInfo`)
        .then(self.setCurrentUserInfo)
        .catch((ex) => {
          Notification.error({
            description: '获取用户信息异常:' + ex,
            duration: null
          });
        });
    },
    setCurrentUserInfo({ data: result }) {
      if (result.success) {
        self.userInfo = result.data;
      } else {
        Notification.error({
          description: '获取用户信息错误:' + result.message,
          duration: null
        });
      }
    }
  }));

export const Category = types.model('Category', {
  value: '0',
  label: ''
});

export const Brand = types.model('Category', {
  value: '0',
  label: ''
});