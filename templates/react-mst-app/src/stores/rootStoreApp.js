import { types } from 'mobx-state-tree';
import { CommonStore } from './commonStore';
import HeaderStore from './headerStore';
import ConditionStore from './conditionStore';
import ChartExampleStore from './pages/chartExampleStore';
import ListExampleStore from './pages/listExampleStore';
//{importStore}//

// prettier-ignore
const RootStore = types.model('RootStore', {
  common: types.optional(CommonStore, {}),

  header: types.optional(HeaderStore, {
    current: 0
  }),

  conditions: types.optional(ConditionStore, {}),
  chartExample: types.optional(ChartExampleStore, {}),
  listExample: types.optional(ListExampleStore, {}),
  //{pageStore}//
});

export default RootStore;