const Notification = {};
export default Notification;

export function createNotification(notification, isMobile) {
  Notification.success = ({ title, description, duration, onClose, mask }) => {
    return notification[0].success(description, duration == null ? 2 : duration, onClose, mask);
  };

  Notification.error = ({ title, description, duration, onClose, mask, actions }) => {
    return notification[1].alert(title, description, actions);
  };
}
