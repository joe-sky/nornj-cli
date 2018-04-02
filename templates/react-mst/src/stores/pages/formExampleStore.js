import { types } from "mobx-state-tree";
import { observable, toJS } from 'mobx';
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import Notification from '../../utils/notification';

const FormExampleStore = types.model("FormExampleStore", {
    antInputValue: '示例数据',
    antSelectValue: '1',
    antRadioValue: '2',
    elInputValue: '示例数据',
    elSelectValue: '1',
    elRadioValue: '2',
  })
  .volatile(self => ({
    antCheckboxValue: [],
    antDate: null,
    elCheckboxValue: [],
    elDate: null
  }))
  .views(self => ({
    get formModel() {
      return {
        formEl1: self.elInputValue,
        formEl2: self.elSelectValue,
        formEl3: self.elRadioValue,
        formEl4: self.elCheckboxValue,
        formEl5: self.elDate
      };
    }
  }))
  .actions(self => {
    return {
      setElInputValue(v) {
        self.elInputValue = v;
      },
      setElSelectValue(v) {
        self.elSelectValue = v;
      },
      setElRadioValue(v) {
        self.elRadioValue = v;
      },
      setElCheckboxValue(v) {
        self.elCheckboxValue = v;
      },
      setElDate(v) {
        self.elDate = v;
      }
    };
  });

export default FormExampleStore;