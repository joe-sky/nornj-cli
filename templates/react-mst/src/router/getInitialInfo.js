async function getInitialInfo(store) {
  store.sider.setCurrentMenu();
  if (!store.common.userInfo) {
    await store.common.getCurrentUserInfo(); //获取用户登录信息
  }
}

export default getInitialInfo;
