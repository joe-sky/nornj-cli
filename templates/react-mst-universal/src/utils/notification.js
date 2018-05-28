import Message from 'flarej/lib/components/antd/message';
const Notification = {};
export default Notification;

export function createNotification(notification, isMobile) {
  Notification.success = ({ title, description, duration, onClose, mask }) => {
    if (!isMobile) {
      return notification.success({ title, description, duration: duration == null ? 2 : duration });
    } else {
      return notification[0].success(description, duration == null ? 2 : duration, onClose, mask);
    }
  };

  Notification.error = ({ title, description, duration, onClose, mask, actions }) => {
    if (!isMobile) {
      Message.destroy();
      if(description.indexOf('NotLogin') > -1) {
        location.href = '/home';
        return;
      }

      if (description.indexOf('您尚未开通此品类/品牌数据权限') > -1
        || description.indexOf('您尚未开通任何品类/品牌数据权限') > -1) {
        if (!Notification.showAuth) {
          Notification.showAuth = true;
          return notification.warning({ title, description, duration: null, onClose: () => Notification.showAuth = false });
        }
      } else {
        return notification.error({ title, description, duration: duration == null ? 2 : duration });
      }
    } else {
      return notification[1].alert(title, description, actions);
    }
  };
}