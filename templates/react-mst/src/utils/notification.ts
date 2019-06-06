import { message, notification } from 'antd';
import { ArgsProps } from 'antd/lib/notification/index';
import isString from 'lodash/isString';

interface INotification {
  success(args: ArgsProps): void;
  error(args: ArgsProps): void;
  showAuth?: boolean;
}

const Notification: INotification = {
  success: ({ duration, ...others }) => {
    return notification.success({
      duration: duration == null ? 2 : duration,
      ...others
    });
  },

  error: ({ message: msg, duration, ...others }) => {
    message.destroy();
    if (isString(msg) && msg.indexOf('NotLogin') > -1) {
      location.href = '/home';
      return;
    }

    if ((isString(msg) && msg.indexOf('message1') > -1) || (isString(msg) && msg.indexOf('message2') > -1)) {
      if (!Notification.showAuth) {
        Notification.showAuth = true;
        return notification.warning({
          message: msg,
          duration: null,
          onClose: () => (Notification.showAuth = false),
          ...others
        });
      }
    } else {
      return notification.error({
        message: msg,
        duration: duration == null ? 2 : duration,
        ...others
      });
    }
  }
};

export default Notification;
