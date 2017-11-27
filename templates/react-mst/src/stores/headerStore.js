import { types } from "mobx-state-tree"

const HeaderStore = types.model("HeaderStore", {
    current: types.number,
    title: '' //在导航栏显示当前页标题，用于app
  })
  .actions(self => {
    return {
      setCurrent(index) {
        self.current = index
      },
      setPageTitle(title) { //设置标题
        self.title = title;
      }
    }
  });

export default HeaderStore