import { types } from 'mobx-state-tree';
import Notification from '../utils/notification';

export default types.model('BaseStore').actions(self => ({
  receiveResponse(fn: Function) {
    const res = fn();
    if (!res.data.success) {
      Notification.error({
        message: `${res.data.errorTitle}错误：` + res.data.message
      });
    }

    return res;
  }
}));
