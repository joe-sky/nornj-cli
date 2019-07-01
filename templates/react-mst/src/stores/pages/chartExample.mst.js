import { types } from 'mobx-state-tree';
import { toJS } from 'mobx';
import BaseStore from '../base.mst';
import * as api from '@/services/pages/chartExample';
import Notification from '@/utils/notification';

const BrandCompareItem = types
  .model('BrandCompareItem', {
    id: types.number,
    rank: types.number,
    brandLogo: types.string,
    brandName: types.string,
    salesAmount: types.number,
    uvGrowth: types.number,
    uvConversion: types.number,
    userGrowth: types.number,
    price: types.number,
    salesAmountGrowth: types.number,
    categoryGrowth: types.number,
    isChecked: types.optional(types.boolean, () => false),
    trendsData: types.array(types.union(types.array(types.number), types.array(types.string))),
    salesAmountRates: types.number,
    userCount: types.number,
    userCountRates: types.number,
    uv: types.number,
    uvRates: types.number
  })
  .actions(self => ({
    setChecked(checked) {
      self.isChecked = checked;
    }
  }));

const Summary = types.model('Summary', {
  gmv: 0,
  gmvYOY: 0,
  gmvMOM: 0,
  uv: 0,
  uvYOY: 0,
  uvMOM: 0,
  uvRates: 0,
  uvRatesYOY: 0,
  uvRatesMOM: 0,
  userCount: 0,
  userCountYOY: 0,
  userCountMOM: 0
});

const ChartExampleStore = BaseStore.named('ChartExampleStore')
  .props({
    summaryData: types.optional(Summary, () => {
      return {
        gmv: 0,
        gmvYOY: 0,
        gmvMOM: 0,
        uv: 0,
        uvYOY: 0,
        uvMOM: 0,
        uvRates: 0,
        uvRatesYOY: 0,
        uvRatesMOM: 0,
        userCount: 0,
        userCountYOY: 0,
        userCountMOM: 0
      };
    }),
    growthDataTable: types.optional(types.array(types.array(types.number)), () => [[0, 0, 0, 0], [0, 0, 0, 0]]),
    brandCompareListTotalCount: types.optional(types.number, () => 0),
    compareDockVisible: types.optional(types.boolean, () => false),
    showCompareTable: types.optional(types.boolean, () => false),
    showSubCategoryBlock: types.optional(types.boolean, () => true)
  })
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
    getSummaryData() {
      return api.getSummaryData().then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            if (data) {
              for (let key of Object.keys(data)) {
                self.summaryData[key] = parseFloat((data[key] * 100).toFixed(2));
              }
              self.summaryData.gmv = data.gmv || 0;
              self.summaryData.gmvYOY = data.gmvYOY ? parseFloat((data.gmvYOY * 100).toFixed(2)) : 0;
              self.summaryData.gmvMOM = data.gmvMOM ? parseFloat((data.gmvMOM * 100).toFixed(2)) : 0;
              self.summaryData.uv = data.uv || 0;
              self.summaryData.uvYOY = data.uvYOY ? parseFloat((data.uvYOY * 100).toFixed(2)) : 0;
              self.summaryData.uvMOM = data.uvMOM ? parseFloat((data.uvMOM * 100).toFixed(2)) : 0;
              self.summaryData.uvRates = data.uvRates ? parseFloat((data.uvRates * 100).toFixed(2)) : 0;
              self.summaryData.uvRatesYOY = data.uvRatesYOY ? parseFloat((data.uvRatesYOY * 100).toFixed(2)) : 0;
              self.summaryData.uvRatesMOM = data.uvRatesMOM ? parseFloat((data.uvRatesMOM * 100).toFixed(2)) : 0;
              self.summaryData.userCount = data.userCount || 0;
              self.summaryData.userCountYOY = data.userCountYOY ? parseFloat((data.userCountYOY * 100).toFixed(2)) : 0;
              self.summaryData.userCountMOM = data.userCountMOM ? parseFloat((data.userCountMOM * 100).toFixed(2)) : 0;
            } else {
              self.summaryData = {
                gmv: 0,
                gmvYOY: 0,
                gmvMOM: 0,
                uv: 0,
                uvYOY: 0,
                uvMOM: 0,
                uvRates: 0,
                uvRatesYOY: 0,
                uvRatesMOM: 0,
                userCount: 0,
                userCountYOY: 0,
                userCountMOM: 0
              };
            }
          }
          return res;
        })
      );
    },

    getGrowthData(params) {
      return api.getGrowthData(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            self.salesData = data.salesData;
            self.salesRatesData = data.salesRatesData;
            self.growthDataUV = data.growthDataUV;
            self.growthDataUVConvert = data.growthDataUVConvert;
            self.growthDataUser = data.growthDataUser;
            self.growthDataPrice = data.growthDataPrice;
            if (data.growthDataTable == null || data.growthDataTable.length == 0) {
              self.growthDataTable = [[0, 0, 0, 0], [0, 0, 0, 0]];
            } else {
              if (data.growthDataTable[0].length == 0 && data.growthDataTable[1].length == 0) {
                self.growthDataTable = [[0, 0, 0, 0], [0, 0, 0, 0]];
              } else {
                self.growthDataTable = data.growthDataTable;
              }
            }
          }
          return res;
        })
      );
    },

    getSubCategoryData(params) {
      return api.getSubCategoryData(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            if (res.data.data) {
              const data = res.data.data || [[], [], []];
              self.pieSubCategoryData = [data[0], data[1], data[2]];
              self.setShowSubCategoryBlock(true);
            } else {
              self.setShowSubCategoryBlock(false);
            }
          }
          return res;
        })
      );
    },

    getBarSubCategoryData(params) {
      return api.getBarSubCategoryData(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            if (res.data.data) {
              const data = res.data.data || [[], [], []];
              self.barSubCategoryData = [data[0], data[1], data[2]];
            }
          }
          return res;
        })
      );
    },

    getTableSubCategoryData(params) {
      return api.getTableSubCategoryData(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            self.tableSubCategoryData = data;
          }
          return res;
        })
      );
    },

    getBrandCompareList(params) {
      return api.getBrandCompareList(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            const data = res.data.data;
            self.brandCompareList = data.map(item => {
              item.salesAmount = parseFloat((item.salesAmount / 10000).toFixed(2));
              return item;
            });
            self.brandCompareListTotalCount = res.data.total;
          }
          return res;
        })
      );
    },

    setCompareDockData(item) {
      if (self.compareDockData) {
        self.compareDockData.push(item);
        self.compareDockData = [...self.compareDockData];
      } else {
        self.compareDockData = [item];
      }
    },

    removeCompareDockData(item) {
      if (self.compareDockData) {
        self.compareDockData.splice(self.compareDockData.findIndex(i => i.id == item.id), 1);
        self.compareDockData = [...self.compareDockData];
      }
    },

    clearCompareDockData() {
      self.compareDockData = self.compareDockData && toJS(self.compareDockData).splice(0, 1);
      self.brandCompareList = [
        ...self.brandCompareList.map(item => {
          item.isChecked = false;
          return item;
        })
      ];
    },

    setCompareDockVisible(visible) {
      self.compareDockVisible = visible;
    },

    setShowCompareTable(visible) {
      self.showCompareTable = visible;
    },

    getBrandCompareItemForCategory(params) {
      return api.getBrandCompareItemForCategory(params).then(res =>
        self.receiveResponse(() => {
          if (res.data.success) {
            let data = res.data.data;
            if (self.compareDockData) {
              self.compareDockData.splice(self.compareDockData.findIndex(i => i.id == data.id), 1);
              data.salesAmount = null;
              data.salesAmountRates = null;
              data.userCount = null;
              data.userCountRates = null;
              data.uv = null;
              data.uvRates = null;
              self.compareDockData.splice(0, 0, data);
            } else {
              data.salesAmount = null;
              data.salesAmountRates = null;
              data.userCount = null;
              data.userCountRates = null;
              data.uv = null;
              data.uvRates = null;
              self.setCompareDockData(data);
            }
          }
          return res;
        })
      );
    },

    setShowSubCategoryBlock(value) {
      self.showSubCategoryBlock = value;
    },
    setChecked(checkedItem, checked) {
      self.brandCompareList = self.brandCompareList.map((item, i) => {
        if (checkedItem.id == item.id) {
          item.isChecked = checked;
        }
        return item;
      });
    }
  }));

export default ChartExampleStore;
