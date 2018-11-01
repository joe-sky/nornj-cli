import React from 'react';
import Popup from 'flarej/lib/components/antd-mobile/popup';
import List from 'flarej/lib/components/antd-mobile/list';
import Icon from 'flarej/lib/components/antd-mobile/icon';

//popup begin
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  };
}

const onPopupCloseButtonClick = () => {
  Popup.hide();
};

export function popupRenderHeader(ttl) {
  return (
    <div style={{ position: 'relative' }}>
      {ttl}
      <span
        style={{
          position: 'absolute',
          right: 3,
          top: -5
        }}
        onClick={() => onPopupCloseButtonClick('cancel')}>
        <Icon type="cross" />
      </span>
    </div>
  );
}

function getEmptyContentForPopup() {
  return (
    <div className="popup-list-empty">
      <div className="con">暂无内容</div>
    </div>
  );
}

export function showPopup(headerTitle, content) {
  Popup.show(
    <div className="popup-list">
      <List renderHeader={() => popupRenderHeader(headerTitle)}>{content ? content : getEmptyContentForPopup()}</List>
    </div>,
    { animationType: 'slide-up', maskProps, maskClosable: false }
  );
}
//popup end
