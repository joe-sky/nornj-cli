import { observable, computed, action, toJS } from 'mobx';
import * as api from '@/services/pages/formExample';
import moment from 'moment';

class FormExampleStore {
  @observable antInputValue = '示例数据';
  @observable antSelectValue = '1';
  @observable antRadioValue = '2';
  @observable elInputValue = '示例数据';
  @observable elSelectValue = '1';
  @observable elRadioValue = '2';
  @observable antCheckboxValue: string[] = [];
  @observable antDate: moment.Moment = null;
  @observable elCheckboxValue: string[] = [];
  @observable elDate: moment.Moment = null;
  @computed get formModel() {
    return {
      formEl1: this.elInputValue,
      formEl2: this.elSelectValue,
      formEl3: this.elRadioValue,
      formEl4: this.elCheckboxValue,
      formEl5: this.elDate
    };
  }
  @observable modData: any = null;

  @action
  setElInputValue(v: string) {
    this.elInputValue = v;
  }

  @action
  setElSelectValue(v: string) {
    this.elSelectValue = v;
  }

  @action
  setElRadioValue(v: string) {
    this.elRadioValue = v;
  }

  @action
  setElCheckboxValue(v: string[]) {
    this.elCheckboxValue = v;
  }

  @action
  setElDate(v: moment.Moment) {
    this.elDate = v;
  }

  @action
  async getModData(params: object) {
    const res: ServiceResponse = await api.getModData(params);
    this.modData = res.data.data;
  }
}

export default FormExampleStore;
