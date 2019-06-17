import { types } from 'mobx-state-tree';
import BaseStore from '../base.mst';
import * as api from '../../services/pages/emptyExample';

const EmptyExampleStore = BaseStore.named('EmptyExampleStore')
  .props({
    bool: types.optional(types.boolean, true),
    strs: types.optional(types.string, ''),
    arrs: types.optional(types.array(types.string), [])
  })
  .volatile(self => ({
    modData: null
  }))
  .views(self => ({}))
  .actions(_self => {
    const self = _self as typeof EmptyExampleStore.Type;
    return {
      afterCreate() {},

      getModData(params: object) {
        return api.getModData(params).then((res: ServiceResponse) =>
          self.receiveResponse(() => {
            if (res.data.success) {
              self.modData = res.data.data;
            }
            return res;
          })
        );
      }
    };
  });

export default EmptyExampleStore;
