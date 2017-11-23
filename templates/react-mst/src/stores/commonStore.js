import { types } from "mobx-state-tree"
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import Notification from '../utils/notification';

export const UserInfo = types.model('UserInfo', {
  pin: types.maybe(types.string),
  name: types.maybe(types.string),
})

export const CommonStore = types.model("CommonStore", {
  userInfo: types.maybe(UserInfo),

  get isDemo() {
    return this.userInfo.pin && this.userInfo.pin.trim().toLowerCase() === 'jd_653e751552511';
  }
}, {
  getCurrentUserInfo() {
    return fetchData(`${__HOST}/common/getCurrentUserInfo`,
      this.setCurrentUserInfo,
      null, { method: 'post' }).catch((ex) => {
      Notification.error({
        description: '获取用户信息异常:' + ex,
        duration: null
      });
    });
  },
  setCurrentUserInfo(result) {
    if (result.success) {
      this.userInfo = result.data;
    } else {
      Notification.error({
        description: '获取用户信息错误:' + result.message,
        duration: null
      });
    }
  },
});

export const Category = types.model("Category", {
  value: '0',
  label: ''
});

export const Brand = types.model("Category", {
  value: '0',
  label: ''
});
