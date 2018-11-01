import * as React from 'react';
import { Component, PropTypes } from 'react';
import { observable, computed, toJS, runInAction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import { WhiteSpace, List, Picker, DatePicker, InputItem, Button, Card, Toast } from 'antd-mobile';
import moment from 'moment';
import storejs from 'storejs';

const BRAND_NOT_ALL = ['2', '5', '8'];

@registerTmpl('conditions')
@inject('store')
@observer
export default class Conditions extends Component {
  constructor(props) {
    super(props);
    this.KEYCONDITIONSCATEGORYEMPTY = '';
  }

  @observable
  defaultDate;
  @observable
  showDateType = 'month';

  componentWillMount() {
    const { defaultValueType, showDateDays } = this.props;

    const { conditions, common } = this.props.store;
    if (common.isDemo) {
      this.defaultDate = moment('2017-08-31');
    } else {
      if (defaultValueType === '3') {
        this.defaultDate = moment();
      } else {
        if (!showDateDays) {
          if (moment().date() > 8) {
            this.defaultDate = moment().subtract(1, 'months');
          } else {
            this.defaultDate = moment().subtract(2, 'months');
          }
        } else {
          this.defaultDate = moment().subtract(1, 'days');
        }
      }
    }

    if (!showDateDays) {
      conditions.setSelectedDate(this.defaultDate.format('YYYY-MM'));
    } else {
      this.showDateType = 'date';
      conditions.setSelectedDate(this.defaultDate.format('YYYY-MM-DD'));
    }
  }

  componentDidMount() {
    const { conditions } = this.props.store;
    const { showCategoryHasLevel4, showProp, defaultValueType, initCategory, initPropName, onSearch } = this.props;
    let initFn = () => {
      typeof onSearch === 'function' && onSearch();
    };

    initFn = () => {
      //closeLoading();
      this.props.onSearch();
    };

    Promise.all([
      //conditions.getDeptData(),
      !showCategoryHasLevel4
        ? conditions.getCategoryData()
        : conditions.getCategoryHasLevel4Data({ date: conditions.selectedDate })
    ]).then(() => {
      switch (defaultValueType) {
        case '1':
          {
            //1、2级品类必选
            const v = conditions.getCategoryDefaultValue('1');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              initFn();
            });
          }
          break;
        case '7':
          {
            //1、2级品类必选
            const v = conditions.getCategoryDefaultValue('1');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              conditions.getBrandData({ categoryId1: v.values[0], notAll: false }).then(() => {
                initFn();
              });
            });
          }
          break;
        case '2':
          {
            //1级品类、品牌必选
            const v = conditions.getCategoryDefaultValue('2');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              conditions.getBrandData({ categoryId1: v.values[0], notAll: true }).then(() => {
                initFn();
              });
            });
          }
          break;
        case '3':
          {
            //1级品类必选
            const v = conditions.getCategoryDefaultValue('3');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              conditions.getBrandData({ categoryId1: v.values[0] }).then(() => {
                initFn();
              });
            });
          }
          break;
        case '4':
          {
            //1、2、3、4级品类必选
            runInAction(() => {
              if (!initCategory) {
                const v = conditions.getCategoryDefaultValue('4');
                conditions.setSelectedCategoryHasLevel4(v.values, v.options);
              }

              if (showProp) {
                conditions.getPropData(conditions.getParamsHasLevel4()).then(() => {
                  if (initPropName) {
                    conditions.setSelectedPropLabel(initPropName.subName + '——' + initPropName.propName);
                  }
                  initFn();
                });
              } else {
                initFn();
              }
            });
          }
          break;
        case '5':
          {
            //1、2级品类、品牌必选
            const v = conditions.getCategoryDefaultValue('1');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              conditions.getBrandData({ categoryId1: v.values[0], categoryId2: v.values[1], notAll: true }).then(() => {
                initFn();
              });
            });
          }
          break;
        case '6':
          {
            //1、2、3级品类必选
            const v = conditions.getCategoryDefaultValue('6');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              initFn();
            });
          }
          break;
        case '7':
          {
            //1、2级品类、品牌必选
            const v = conditions.getCategoryDefaultValue('1');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              conditions.getBrandData({ categoryId1: v.values[0], categoryId2: v.values[1] }).then(() => {
                initFn();
              });
            });
          }
          break;
        case '8':
          {
            //1、2、3级品类、品牌必选
            const v = conditions.getCategoryDefaultValue('6');
            runInAction(() => {
              conditions.setSelectedCategory(v.values, v.options);
              conditions
                .getBrandData({
                  categoryId1: v.values[0],
                  categoryId2: v.values[1],
                  categoryId3: v.values[2],
                  notAll: true
                })
                .then(() => {
                  initFn();
                });
            });
          }
          break;
        default:
          initFn();
          break;
      }
      this.reformCategoryData(defaultValueType);
    });
  }

  reformCategoryData(valueType) {
    let level = null;
    switch (valueType) {
      case '1':
      case '5':
      case '7':
        level = 2;
        break;
      case '2':
      case '3':
        level = 1;
        break;
      case '6':
      case '8':
        level = 3;
        break;
      case '4':
        level = 4;
        break;
    }
    const reformer = (lvl, cd, deep) => {
      if (typeof lvl !== 'number') {
        return;
      }
      if (!deep) {
        deep = 1;
      }
      //const { store: {conditions} } = this.props;
      //console.log(toJS(conditions.categoryData));
      let hasChildren = false;
      if (cd && cd instanceof Array && cd.length > 0) {
        hasChildren = true;
      }
      if (hasChildren) {
        if (deep > lvl && cd[0].value !== this.KEYCONDITIONSCATEGORYEMPTY) {
          cd.unshift({ value: this.KEYCONDITIONSCATEGORYEMPTY, label: '全部' });
        }
        for (let i = 0; i < cd.length; i++) {
          if (cd[i] && cd[i].children) {
            const deepNext = deep + 1;
            cd[i].children = reformer(lvl, cd[i].children, deepNext);
          }
        }
      }
      return cd;
    };
    const {
      store: { conditions }
    } = this.props;
    const cd = reformer(level, toJS(conditions.categoryData));
    conditions.setCategoryData({ data: { success: true, data: cd } });
  }

  @autobind
  onCategoryChange(value, selectedOptions) {
    const { defaultValueType } = this.props;
    switch (defaultValueType) {
      case '1':
      case '5':
      case '7':
        {
          //1、2级品类必选
          if (value.length < 2) {
            return;
          }
        }
        break;
      case '2':
      case '3':
        {
          //1级品类必选
          if (value.length < 1) {
            return;
          }
        }
        break;
      case '6':
        {
          //1、2、3级品类必选
          if (value.length < 3) {
            return;
          }
        }
        break;
      case '8':
        {
          //1、2、3级品类必选
          if (value.length < 3) {
            return;
          }
        }
        break;
    }

    this.props.store.conditions.setSelectedCategory(value, selectedOptions);
    if (this.props.showBrand || this.props.showMultiBrand) {
      this.props.store.conditions.getBrandData({
        categoryId1: value[0],
        categoryId2: value[1],
        categoryId3: value[2],
        notAll: BRAND_NOT_ALL.indexOf(defaultValueType) >= 0
      });
    }
    this.categoryChanged = true;
    // if (this.props.showCategoryLevel4 && value[2]) {
    //   this.props.store.conditions.getCategoryLevel4Data({ categoryId3: value[2] });
    // }
  }

  @autobind
  onCategoryHasLevel4Change(value) {
    const selectedOptions = [];
    if (value && value.length > 0) {
      let chlv4 = toJS(this.props.store.conditions.categoryHasLevel4Data);
      for (let i = 0; i < value.length; i++) {
        if (chlv4 && chlv4 instanceof Array) {
          chlv4 = chlv4.filter(item => item.value === value[i]);
          if (chlv4.length > 0) {
            chlv4 = chlv4[0];
          } else {
            chlv4 = null;
          }
        }
        const opt = chlv4
          ? {
              label: chlv4.label,
              value: chlv4.value
            }
          : {};
        selectedOptions.push(opt);
        if (chlv4) {
          chlv4 = chlv4.children;
        }
      }
    }
    this.props.store.conditions.setSelectedCategoryHasLevel4(value, selectedOptions);
    if (this.props.showProp) {
      this.props.store.conditions.getPropData(this.props.store.conditions.getParamsHasLevel4());
    }
  }

  @autobind
  propFilterOption(inputValue, option) {
    if (option.props.children.indexOf(inputValue) > -1) {
      return true;
    }
  }

  @computed
  get selectedProp() {
    return ['' + this.props.store.conditions.selectedProp];
  }

  @autobind
  onPropChange(value) {
    this.props.store.conditions.setSelectedProp(value);
  }

  /*
    已废弃
  */
  @autobind
  onCategoryLevel4Change(value) {
    this.props.store.conditions.setSelectedCategoryLevel4(value);
    this.props.store.conditions.getBrandData({
      categoryId1: this.props.store.conditions.selectedCategory[0],
      categoryId2: this.props.store.conditions.selectedCategory[1],
      categoryId3: this.props.store.conditions.selectedCategory[2],
      categoryId4: value
    });
  }

  @autobind
  onDateChange(date) {
    const { conditions } = this.props.store;
    const dateString = moment(date).format('YYYY-MM-DD');
    conditions.setSelectedDate(this.getDateFormatted(dateString));
    this.defaultDate = dateString;
    const { showCategoryHasLevel4, showProp } = this.props;
    if (showCategoryHasLevel4) {
      conditions.getCategoryHasLevel4Data({ date: dateString }).then(() => {
        // const v = conditions.getCategoryDefaultValue('4');
        // conditions.setSelectedCategoryHasLevel4(v.values, v.options);
        if (showProp) {
          conditions.getPropData(conditions.getParamsHasLevel4({ date: dateString }));
        }
      });
    }
  }

  @autobind
  onDeptChange(value) {
    this.props.store.conditions.setSelectedDept(value);
  }

  @computed
  get selectedBrand() {
    return ['' + this.props.store.conditions.selectedBrand];
  }

  @autobind
  onBrandChange(value) {
    value = parseInt(value);
    if (isNaN(value)) {
      value = 0;
    }
    this.props.store.conditions.setSelectedBrand(value);
  }

  @autobind
  onMultiBrandChange(value) {
    this.props.store.conditions.setSelectedMultiBrand(value);
  }

  @computed
  get selectedScope() {
    return ['' + this.props.store.conditions.selectedScope];
  }

  @autobind
  onScopeChange(value) {
    this.props.store.conditions.setSelectedScope(value);
  }

  @autobind
  onClick(event) {
    this.props.onSearch();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.categoryChanged && nextProps.showBrand && !this.props.showBrand) {
      this.props.store.conditions.getBrandData({
        categoryId1: nextProps.store.conditions.selectedCategory[0],
        categoryId2: nextProps.store.conditions.selectedCategory[1],
        categoryId3: nextProps.store.conditions.selectedCategory[2],
        categoryId4: nextProps.showCategoryHasLevel4 ? nextProps.store.conditions.selectedCategory[3] : '',
        notAll: BRAND_NOT_ALL.indexOf(nextProps.defaultValueType) >= 0
      });
      this.categoryChanged = false;
    }
  }

  @autobind
  getDateFormatted(d) {
    const { showDateDays } = this.props;
    const f = showDateDays ? 'YYYY-MM-DD' : 'YYYY-MM';
    return moment(d).format(f);
  }

  @autobind
  datePickerFormatter(val) {
    return this.getDateFormatted(val);
  }

  @computed
  get selectedDate() {
    if (this.props.showDateDays) {
      return moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');
    } else {
      return new Date(this.defaultDate);
    }
  }

  render() {
    const {
      store: { conditions },
      showDept,
      showCategory,
      showCategoryHasLevel4,
      showProp,
      showBrand,
      showMultiBrand,
      showVendor,
      showDate,
      showSKU,
      showScope,
      conditionBtnContent
    } = this.props;

    return (
      <Card full className="conditions">
        <style jsx global>{`
          .conditions {
            .csInput {
              input {
                text-align: right;
              }
            }
          }
        `}</style>
        <Card.Body>
          <List>
            <if condition={showDept}>
              <Picker
                data={toJS(conditions.deptData)}
                value={conditions.selectedDept}
                title="选择部门"
                onChange={this.onDeptChange}>
                <List.Item arrow="horizontal">部门</List.Item>
              </Picker>
            </if>

            <if condition={showCategory && !showCategoryHasLevel4}>
              <Picker
                data={toJS(conditions.categoryData)}
                value={toJS(conditions.selectedCategory)}
                title="选择品类"
                onChange={this.onCategoryChange}>
                <List.Item arrow="horizontal">品类</List.Item>
              </Picker>
            </if>

            <if condition={showCategoryHasLevel4}>
              <Picker
                data={toJS(conditions.categoryHasLevel4Data)}
                value={toJS(conditions.selectedCategoryHasLevel4)}
                title="选择品类"
                cols={4}
                onChange={this.onCategoryHasLevel4Change}>
                <List.Item arrow="horizontal">品类</List.Item>
              </Picker>
            </if>

            <if condition={showProp}>
              <Picker
                extra={this.selectedProp}
                data={toJS(conditions.propData)}
                value={this.selectedProp}
                title="选择属性"
                cols={1}
                onChange={this.onPropChange}>
                <List.Item arrow="horizontal">属性</List.Item>
              </Picker>
            </if>

            <if condition={showBrand && !showMultiBrand}>
              <Picker
                data={toJS(conditions.brandData)}
                value={this.selectedBrand}
                title="选择品牌"
                cols={1}
                onChange={this.onBrandChange}>
                <List.Item arrow="horizontal">品牌</List.Item>
              </Picker>
            </if>

            <if condition={showVendor}>
              <Picker
                cols={1}
                data={toJS(conditions.vendorData)}
                value={conditions.selectedVendor + ''}
                title="选择供应商"
                onChange={this.onVendorChange}>
                <List.Item arrow="horizontal">品牌</List.Item>
              </Picker>
            </if>

            <if condition={showDate}>
              <DatePicker
                title="选择日期"
                mode={this.showDateType}
                format={this.datePickerFormatter}
                value={this.selectedDate}
                onChange={this.onDateChange}>
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
            </if>

            <if condition={showSKU}>
              <List.Item extra={<InputItem placeholder="请输入" onChange={this.onSKUChange} className="csInput" />}>
                SKU
              </List.Item>
            </if>

            <if condition={showScope}>
              <Picker
                data={toJS(conditions.scopeData)}
                value={this.selectedScope}
                title="选择范围"
                cols={1}
                onChange={this.onScopeChange}>
                <List.Item arrow="horizontal">范围</List.Item>
              </Picker>
            </if>
          </List>
          <WhiteSpace />
          <Button type="primary" onClick={this.onClick}>
            {conditionBtnContent}
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

Conditions.propTypes = {
  showCategory: React.PropTypes.bool,
  showDate: React.PropTypes.bool,
  showBrand: React.PropTypes.bool,
  showProp: React.PropTypes.bool,
  showDept: React.PropTypes.bool,
  showDataRange: React.PropTypes.bool,
  showSKU: React.PropTypes.bool,
  showDistCenter: React.PropTypes.bool,
  showElement: React.PropTypes.bool,
  onSearch: React.PropTypes.func
};

Conditions.defaultProps = {
  showCategory: false,
  showDate: false,
  showBrand: false,
  showProp: false,
  showDept: false,
  showDataRange: false,
  showSKU: false,
  showDistCenter: false,
  showElement: false,
  onSearch: () => {},
  conditionBtnContent: '查询',
  defaultValueType: null
};
