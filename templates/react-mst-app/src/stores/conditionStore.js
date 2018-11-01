import { types, detach, getParent } from 'mobx-state-tree';
import { toJS } from 'mobx';
import axios from 'axios';
import Notification from '../utils/notification';
import moment from 'moment';

const CategoryOption = types
  .model('CategoryOption', {
    value: types.optional(types.identifier, () => ''),
    label: types.optional(types.string, () => ''),
    children: types.maybe(types.array(types.late(() => CategoryOption)))
  })
  .actions(self => ({
    beforeDestroy() {
      detach(self);
    }
  }));

const BrandOption = types.model('BrandOption', {
  value: types.optional(types.identifier, () => ''),
  label: types.optional(types.string, () => '')
});
const CategoryLevel4Option = types.model('CategoryLevel4Option', {
  value: types.optional(types.identifier, () => ''),
  label: types.optional(types.string, () => '')
});
const DeptOption = types.model('DeptOption', {
  value: types.optional(types.identifier, () => ''),
  label: types.optional(types.string, () => '')
});
const VendorOption = types.model('VendorOption', {
  value: types.optional(types.identifier, () => ''),
  label: types.optional(types.string, () => '')
});
const PropOption = types.model('PropOption', {
  value: types.optional(types.identifier, () => ''),
  label: types.optional(types.string, () => '')
});
const ScopeOption = types.model('ScopeOption', {
  value: types.optional(types.identifier, () => ''),
  label: types.optional(types.string, () => '')
});

const conditionKeys = [
  'inPageStore',
  'selectedCategory',
  'selectedCategoryHasLevel4',
  'selectedCategoryLevel4',
  'selectedDate',
  'selectedBrand',
  'selectedMultiBrand',
  'selectedProp',
  'selectedDept',
  'selectedVendor',
  'selectedDateRange',
  'selectedScope',
  'selectedCategoryOptions',
  'selectedCategoryHasLevel4Options',
  'selectedCategoryLevel4Options'
];

const ConditionStore = types
  .model('ConditionStore', {
    inPageStore: false,
    categoryLevel4Data: types.optional(types.array(CategoryLevel4Option), () => [{ value: '0', label: '全部' }]),
    selectedCategory: types.optional(types.array(types.string), () => []),
    selectedCategoryHasLevel4: types.optional(types.array(types.string), () => []),
    selectedCategoryLevel4: types.optional(types.number, () => 0),
    selectedDate: types.optional(types.string, () => moment('2017-08-01').format('YYYY-MM')),
    brandData: types.optional(types.array(BrandOption), () => []),
    selectedBrand: types.optional(types.maybe(types.number), () => 0),
    selectedMultiBrand: types.optional(types.array(types.string), []),
    propData: types.optional(types.array(PropOption), () => []),
    selectedProp: types.optional(types.string, () => '0'),
    deptData: types.optional(types.array(DeptOption), () => []),
    selectedDept: types.optional(types.string, () => ''),
    vendorData: types.optional(types.array(VendorOption), () => [{ value: '0', label: '全部' }]),
    selectedVendor: types.optional(types.string, () => ''),
    selectedDateRange: types.optional(types.array(types.string), []),
    scopeData: types.optional(types.array(ScopeOption), () => [
      { value: '1', label: '本月购买' },
      { value: '2', label: '年度累计' }
    ]),
    selectedScope: types.optional(types.number, () => 1)
  })
  .volatile(self => ({
    categoryData: null,
    categoryHasLevel4Data: null,
    selectedCategoryOptions: null,
    selectedCategoryHasLevel4Options: null,
    selectedCategoryLevel4Options: null,
    selectedBrandOptions: null
  }))
  .views(self => ({
    get root() {
      return !self.inPageStore ? getParent(self) : getParent(getParent(self));
    }
  }))
  .actions(self => ({
    getParamsHasLevel4(params = {}) {
      return Object.assign(
        {
          categoryId1: self.selectedCategoryHasLevel4.length >= 1 ? self.selectedCategoryHasLevel4[0] : '',
          categoryId2: self.selectedCategoryHasLevel4.length >= 2 ? self.selectedCategoryHasLevel4[1] : '',
          categoryId3: self.selectedCategoryHasLevel4.length >= 3 ? self.selectedCategoryHasLevel4[2] : '',
          categoryId4: encodeURI(
            self.selectedCategoryHasLevel4.length >= 4 ? self.selectedCategoryHasLevel4Options[3].label : ''
          ),
          propId: encodeURI(self.selectedProp != null ? self.selectedProp : ''),
          date: self.selectedDate ? self.selectedDate : ''
        },
        params
      );
    },

    getCategoryData(params, useStock) {
      return axios
        .get(`${__HOST}/common/${!useStock ? 'getCategoryData' : 'getStockCategoryData'}`, {
          params
        })
        .then(self.setCategoryData)
        .catch(ex => {
          Notification.error({ description: '获取品类数据异常:' + ex, duration: null });
        });
    },
    setCategoryData({ data: result }) {
      if (result.success) {
        const data = result.data;
        self.categoryData = data;
      } else {
        Notification.error({ description: '获取品类数据异常1:' + result.message, duration: null });
      }
    },
    setSelectedCategory(selectedItems, selectedOptions) {
      self.selectedCategory = selectedItems;
      self.selectedCategoryOptions = selectedOptions;
    },

    getCategoryHasLevel4Data(params) {
      return axios
        .get(`${__HOST}/common/getCategoryHasLevel4Data`, {
          params
        })
        .then(self.setCategoryHasLevel4Data)
        .catch(ex => {
          Notification.error({ description: '获取品类(包含4级)数据异常:' + ex, duration: null });
        });
    },
    setCategoryHasLevel4Data({ data: result }) {
      if (result.success) {
        const data = result.data;
        self.categoryHasLevel4Data = data;
      } else {
        Notification.error({ description: '获取品类(包含4级)数据错误:' + result.message, duration: null });
      }
    },
    setSelectedCategoryHasLevel4(selectedItems, selectedOptions) {
      self.selectedCategoryHasLevel4 = selectedItems;
      self.selectedCategoryHasLevel4Options = selectedOptions;
    },

    getPropData(params) {
      return axios
        .get(`${__HOST}/common/getPropData`, {
          params
        })
        .then(result => self.setPropData(result, params))
        .catch(ex => {
          Notification.error({ description: '获取属性数据异常:' + ex, duration: null });
        });
    },
    setPropData({ data: result }) {
      if (result.success) {
        let data = result.data;
        self.propData = data;
        self.selectedProp = data.length > 0 ? data[0].label : '请选择';
      } else {
        Notification.error({ description: '获取属性数据异常:' + result.message, duration: null });
      }
    },
    setSelectedProp(value) {
      // self.selectedProp = value;
      /*
     * 此处暂定（后台给的数据是name，暂无法根据id查询）
     * 先属性查询根据 value 反查 label
     */
      const vs = self.propData.map(function(item) {
        return item.value;
      });
      let index;
      for (let i = 0; i < vs.length; i++) {
        if (vs[i] == value) {
          index = i;
          break;
        }
      }
      self.selectedProp = toJS(self.propData)[index].label;
    },

    setSelectedPropLabel(label) {
      self.selectedProp = label;
    },

    getCategoryDefaultValue(type) {
      switch (type) {
        case '1': //1、2级必选
        case '5': {
          const values = [self.categoryData[0].value, self.categoryData[0].children[0].value];
          const options = [self.categoryData[0], self.categoryData[0].children[0]];

          return {
            values,
            options
          };
        }
        case '2': //1级必选
        case '3': {
          const values = [self.categoryData[0].value];
          const options = [self.categoryData[0]];

          return {
            values,
            options
          };
        }
        case '4': {
          //1、2、3、4级品类必选
          const category1 = self.categoryHasLevel4Data[0];
          const category2 = category1.children[0];
          const category3 = category2.children[0];
          const category4 = category3.children && category3.children.length ? category3.children[0] : null;

          const values = [category1.value, category2.value, category3.value];
          const options = [category1, category2, category3];
          if (category4) {
            values.push(category4.value);
            options.push(category4);
          }

          return {
            values,
            options
          };
        }
        case '6': {
          //1、2、3级品类必选
          const values = [
            self.categoryData[0].value,
            self.categoryData[0].children[0].value,
            self.categoryData[0].children[0].children[0].value
          ];
          const options = [
            self.categoryData[0],
            self.categoryData[0].children[0],
            self.categoryData[0].children[0].children[0]
          ];

          return {
            values,
            options
          };
        }
      }
    },

    getCategoryLevel4Data(params) {
      return axios
        .get(`${__HOST}/common/getCategoryLevel4Data`, {
          params
        })
        .then(self.setCategoryLevel4Data)
        .catch(ex => {
          Notification.error({ description: '获取四级品类数据异常:' + ex, duration: null });
        });
    },
    setCategoryLevel4Data({ data: result }) {
      if (result.success) {
        let data = result.data;
        data = [{ value: '0', label: '全部' }].concat(data);
        self.categoryLevel4Data = data;
        self.selectedCategoryLevel4 = +data[0].value;
      } else {
        Notification.error({ description: '获取四级品类数据异常:' + result.message, duration: null });
      }
    },
    setSelectedCategoryLevel4(value) {
      self.selectedCategoryLevel4 = parseInt(value, 10);
    },
    setSelectedDate(date) {
      self.selectedDate = date;
    },
    getBrandData(params, useStock) {
      return axios
        .get(`${__HOST}/common/${!useStock ? 'getBrandData' : 'getStockBrandData'}`, {
          params
        })
        .then(result => self.setBrandData(result, params))
        .catch(ex => {
          Notification.error({ description: '获取品牌数据异常:' + ex, duration: null });
        });
    },
    setBrandData({ data: result }, params) {
      if (result.success) {
        let data = result.data;
        //   if ((!params || !params.notAll) && self.root.common.userInfo.isMainBd) {
        //     data = [{ value: '0', label: '全部' }].concat(data);
        //   }
        self.brandData = data != null ? data : [];
        self.selectedBrand = data && data[0] ? +data[0].value : null;
        self.selectedBrandOptions = data && data[0] ? data[0] : null;
        self.selectedMultiBrand = data && data[0] ? [result.data[0].value] : [];
      } else {
        self.brandData = [];
        self.selectedBrand = null;
        self.selectedBrandOptions = null;
        self.selectedMultiBrand = [];
        Notification.error({ description: '获取品牌数据异常:' + result.message, duration: null });
      }
    },
    checkSelectedBrand() {
      var list = self.brandData.filter(item => {
        return item.value == self.selectedBrand;
      });
      if (!list || list.length == 0) {
        self.selectedBrand = self.brandData && self.brandData[0] ? +self.brandData[0].value : null;
      }
    },
    setSelectedBrand(value) {
      self.selectedBrand = parseInt(value, 10);
      let selectedBrandOptionList = self.brandData.filter(item => {
        return parseInt(item.value, 10) == self.selectedBrand;
      });
      self.selectedBrandOptions = selectedBrandOptionList[0] || null;
    },
    setSelectedMultiBrand(value) {
      self.selectedMultiBrand = value;
    },

    getDeptData(params) {
      return axios
        .get(`${__HOST}/common/getDeptData`, {
          params
        })
        .then(self.setDeptData)
        .catch(ex => {
          Notification.error({ description: '获取部门数据异常:' + ex, duration: null });
        });
    },
    setDeptData({ data: result }) {
      if (result.success) {
        const data = result.data;
        self.deptData = data;
        self.selectedDept = data[0].value.toString();
      } else {
        Notification.error({ description: '获取部门数据异常:' + result.message, duration: null });
      }
    },
    setSelectedDept(value) {
      self.selectedDept = value;
    },

    getVendorData(params) {
      return axios
        .get(`${__HOST}/common/getVendorData`, {
          params
        })
        .then(self.setVendorData)
        .catch(ex => {
          Notification.error({ description: '获取供应商数据异常:' + ex, duration: null });
        });
    },
    setVendorData({ data: result }) {
      if (result.success) {
        let data = result.data;
        if (self.root.common.userInfo.isMainBd) {
          data = [{ value: '0', label: '全部' }].concat(data);
        }
        self.vendorData = data;
        self.selectedVendor = data[0].value.toString();
      } else {
        Notification.error({ description: '获取供应商数据异常:' + result.message, duration: null });
      }
    },
    setSelectedVendor(value) {
      self.selectedVendor = value;
    },

    setSelectedDateRange(date) {
      self.selectedDateRange = date;
    },
    setSelectedScope(value) {
      self.selectedScope = parseInt(value, 10);
    },

    afterCreate() {
      // if (self.root.common.userInfo && self.root.common.userInfo.isMainBd) {
      //   self.brandData = [{ value: '0', label: '全部' }];
      // }
    },
    setValues(conditionHistory) {
      for (let key of conditionKeys) {
        if (conditionHistory[key] != undefined) {
          self[key] = conditionHistory[key];
        }
      }
    },
    getValues() {
      let result = {};
      for (let key of conditionKeys) {
        result[key] = toJS(self[key]);
      }
      return result;
    },
    getConditionGeneralParams(withName) {
      const categoryId1 = self.selectedCategory.length > 0 ? self.selectedCategory[0] : '';
      const categoryId2 = self.selectedCategory.length > 1 ? self.selectedCategory[1] : '';
      const categoryId3 = self.selectedCategory.length > 2 ? self.selectedCategory[2] : '';
      const categoryOptions = toJS(self.selectedCategoryOptions);
      const brandOptions = toJS(self.selectedBrandOptions);
      let result = Object.assign({
        categoryId1: categoryId1,
        categoryId2: categoryId2,
        categoryId3: categoryId3,
        brandId: self.selectedBrand,
        date: self.selectedDate
      });
      if (withName) {
        let categoryName1 = categoryId1 && categoryOptions && categoryOptions[0] && categoryOptions[0].label;
        let categoryName2 = categoryId2 && categoryOptions && categoryOptions[1] && categoryOptions[1].label;
        let categoryName3 = categoryId3 && categoryOptions && categoryOptions[2] && categoryOptions[2].label;
        let categoryDownloadName = categoryName1;
        if (categoryName2) categoryDownloadName += '/' + categoryName2;
        if (categoryName3) categoryDownloadName += '/' + categoryName3;
        result = Object.assign(result, {
          categoryDownloadName: categoryDownloadName,
          brandName: brandOptions && brandOptions.label
        });
      }
      return result;
    }
  }));

export default ConditionStore;
