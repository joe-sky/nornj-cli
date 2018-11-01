import { types } from 'mobx-state-tree';
import { toJS } from 'mobx';
import axios from 'axios';
import Notification from '../../utils/notification';

const ListExampleStore = types
  .model('ListExampleStore', {})
  .volatile(self => ({
    salesData: null,
    salesRatesData: null,
    growthDataUV: null,
    growthDataUVConvert: null,
    growthDataUser: null,
    growthDataPrice: null,
    tableSubCategoryData: null,
    pieSubCategoryData: null,
    barSubCategoryData: null,
    compareDockData: null,
    brandCompareList: null
  }))
  .actions(self => ({
    afterCreate() {}
  }));

export default ListExampleStore;
