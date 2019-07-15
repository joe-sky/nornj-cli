import { types, flow } from 'mobx-state-tree';
import * as api from '@/services/pages/emptyExample';

const EmptyExampleStore = types
  .model('EmptyExampleStore', {
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

      getModData: flow(function*(params: object) {
        const res: ServiceResponse = yield api.getModData(params);
        self.modData = res.data.data;
      })
    };
  });

export default EmptyExampleStore;
