import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import Form from 'flarej/lib/components/antd/form';
import 'flarej/lib/components/antd/input';
import 'flarej/lib/components/antd/select';
import 'flarej/lib/components/antd/radio';
import 'flarej/lib/components/antd/button';
import 'flarej/lib/components/antd/cascader';
import 'flarej/lib/components/antd/datePicker';
import 'flarej/lib/components/antd/checkbox';
import 'flarej/lib/components/element/form';
import 'flarej/lib/components/element/input';
import 'flarej/lib/components/element/select';
import 'flarej/lib/components/element/datePicker';
import 'flarej/lib/components/element/switch';
import 'flarej/lib/components/element/checkbox';
import 'flarej/lib/components/element/radio';
import 'flarej/lib/components/element/cascader';
import { isIElt11 } from 'flarej/lib/utils/browsers';
import styles from './formExample.m.scss';
import tmpls from './formExample.t.html';

// 页面容器组件
@registerTmpl('FormExample')
@inject('store')
@observer
export default class FormExample extends Component {
  render() {
    const { store: { formExample } } = this.props;
    return tmpls.container({
      styles,
      formExample,
      isIElt11
    }, this.props, this);
  }
}

@registerTmpl('AntForm')
@inject('store')
@observer
@Form.create()
@observer
class AntForm extends Component {

  @observable inputValue = '示例数据';

  @observable textareaValue = '示例数据';

  @observable selectValue = '1';

  @observable checkboxValue = ['2'];

  formEl1({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素1不能为空！' }]
    }, ...props})(result());
  }

  formEl2({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素2不能为空！' }]
    }, ...props})(result());
  }

  formEl3({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素3不能为空！' }]
    }, ...props})(result());
  }

  formEl4({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素4不能为空！' }]
    }, ...props})(result());
  }

  formEl5({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素5不能为空！' }]
    }, ...props})(result());
  }

  @autobind
  onAntSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }

  @autobind
  onAntReset() {
    this.props.form.resetFields();
  }

  render() {
    const { store: { formExample } } = this.props;
    return tmpls.antForm({
      styles,
      formExample
    }, this.props, this);
  }
}

@registerTmpl('ElForm')
@inject('store')
@observer
class ElForm extends Component {

  rules = {
    formEl1: [
      { required: true, message: '表单元素1不能为空！' }
    ],
    formEl2: [
      { required: true, message: '表单元素2不能为空！' }
    ],
    formEl3: [
      { required: true, message: '表单元素3不能为空！' }
    ],
    formEl4: [
      { required: true, message: '表单元素4不能为空！', type:'array' }
    ],
    formEl5: [
      { required: true, message: '表单元素5不能为空！' }
    ]
  };

  @autobind
  onElSubmit(e) {
    e.preventDefault();

    this.refs.form.validate((valid) => {
      if (valid) {
        const { store: { formExample } } = this.props;

        console.log(formExample.elInputValue);
        console.log(formExample.elSelectValue);
        console.log(formExample.elRadioValue);
        console.log(formExample.elCheckboxValue);
        console.log(formExample.elDate);
      }
    });
  }

  @autobind
  onElReset() {
    //Element-React的form.resetFields存在bug
    this.refs.form.resetFields();
  }

  render() {
    const { store: { formExample } } = this.props;
    return tmpls.elForm({
      styles,
      formExample
    }, this.props, this);
  }
}