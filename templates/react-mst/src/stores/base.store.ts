import { observable, computed, action, toJS } from 'mobx';
import Notification from '@/utils/notification';

export default class BaseStore {
  @action
  receiveResponse(fn: Function) {
    const res = fn();
    if (!res.data.success) {
      Notification.error({
        message: `${res.data.errorTitle}错误：` + res.data.message
      });
    }

    return res;
  }
}
