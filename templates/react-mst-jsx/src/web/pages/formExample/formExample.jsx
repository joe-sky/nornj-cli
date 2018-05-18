import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import Form from 'flarej/lib/components/antd/form';
import Input from 'flarej/lib/components/antd/input';
import Select from 'flarej/lib/components/antd/select';
import Radio from 'flarej/lib/components/antd/radio';
import Button from 'flarej/lib/components/antd/button';
import Cascader from 'flarej/lib/components/antd/cascader';
import DatePicker from 'flarej/lib/components/antd/datePicker';
import Checkbox from 'flarej/lib/components/antd/checkbox';
import ElForm from 'flarej/lib/components/element/form';
import ElInput from 'flarej/lib/components/element/input';
import ElSelect from 'flarej/lib/components/element/select';
import ElDatePicker from 'flarej/lib/components/element/datePicker';
import ElSwitch from 'flarej/lib/components/element/switch';
import ElCheckbox from 'flarej/lib/components/element/checkbox';
import ElRadio from 'flarej/lib/components/element/radio';
import ElCascader from 'flarej/lib/components/element/cascader';
import { isIElt11 } from 'flarej/lib/utils/browsers';
import styles from './formExample.m.scss';
import { Row, Col } from 'flarej';

// 页面容器组件
@registerTmpl('FormExample')
@inject('store')
@observer
export default class FormExample extends Component {
  render() {
    const { store: { formExample } } = this.props;

    return (
      <div>
        <Col l={6}>
          <AntFormExample />
        </Col>
        <Col l={6}>
          {/*Element-React的部分表单组件无法在ie9和ie10运行*/}
          <if condition={!isIElt11}><ElFormExample /></if>
        </Col>
      </div>
    );
  }
}

@inject('store')
@observer
@Form.create()
@observer
class AntFormExample extends Component {

  @observable inputValue = '示例数据';

  @observable textareaValue = '示例数据';

  @observable selectValue = '1';

  @observable checkboxValue = ['2'];

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

    return (
      <div className={styles.formExample}>
        <h2>Ant Design 表单控件示例</h2>
        <div>
          <div className={styles.formEls}>
            <Input value={this.inputValue} onChange={e => this.inputValue = e.target.value} />
            <div>
              inputValue：<i style={{ color: 'purple' }}>{this.inputValue}</i>
            </div>
          </div>
          <div className={styles.formEls}>
            <Input.TextArea value={this.textareaValue} onChange={e => this.textareaValue = e.target.value} />
            <div>
              textareaValue：<i style={{ color: 'purple' }}>{this.textareaValue}</i>
            </div>
          </div>
          <div className={styles.formEls}>
            <Select value={this.selectValue} onChange={value => this.selectValue = value} style={{ width: '100%' }} placeholder="请选择">
              <Select.Option value="1">测试数据1</Select.Option>
              <Select.Option value="2">测试数据2</Select.Option>
              <Select.Option value="3">测试数据3</Select.Option>
            </Select>
            <div>
              selectValue：<i style={{ color: 'purple' }}>{this.selectValue}</i>
            </div>
          </div>
          <div className={styles.formEls}>
            <Checkbox.Group value={toJS(this.checkboxValue)} onChange={value => this.checkboxValue = value}>
              <Checkbox value="1">Option A</Checkbox>
              <Checkbox value="2">Option B</Checkbox>
              <Checkbox value="3">Option C</Checkbox>
            </Checkbox.Group>
            <div>
              checkboxValue：<i style={{ color: 'purple' }}>{this.checkboxValue}</i>
            </div>
          </div>
        </div>
        <h2>Ant Design 表单验证示例</h2>
        <Form>
          <Form.Item label="表单元素1" {...nj.filters.formItemParams(6)}>
            {
              this.props.form.getFieldDecorator('formEl1', {
                initialValue: formExample.antInputValue,
                rules: [{ required: true, message: '表单元素1不能为空！' }]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label="表单元素2" {...nj.filters.formItemParams(6)}>
            {
              this.props.form.getFieldDecorator('formEl2', {
                initialValue: formExample.antSelectValue,
                rules: [{ required: true, message: '表单元素2不能为空！' }]
              })(
                <Select placeholder="请选择">
                  <Select.Option value="1">测试数据1</Select.Option>
                  <Select.Option value="2">测试数据2</Select.Option>
                  <Select.Option value="3">测试数据3</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="表单元素3" {...nj.filters.formItemParams(6)}>
            {
              this.props.form.getFieldDecorator('formEl3', {
                initialValue: formExample.antRadioValue,
                rules: [{ required: true, message: '表单元素3不能为空！' }]
              })(
                <Radio.Group>
                  <Radio value="1">选项1</Radio>
                  <Radio value="2">选项2</Radio>
                  <Radio value="3">选项3</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label="表单元素4" {...nj.filters.formItemParams(6)}>
            {
              this.props.form.getFieldDecorator('formEl4', {
                initialValue: formExample.antCheckboxValue,
                rules: [{ required: true, message: '表单元素4不能为空！' }]
              })(
                <Checkbox.Group>
                  <Checkbox value="1">Option A</Checkbox>
                  <Checkbox value="2">Option B</Checkbox>
                  <Checkbox value="3">Option C</Checkbox>
                </Checkbox.Group>
              )
            }
          </Form.Item>
          <Form.Item label="表单元素5" {...nj.filters.formItemParams(6)}>
            {
              this.props.form.getFieldDecorator('formEl5', {
                initialValue: formExample.antDate,
                rules: [{ required: true, message: '表单元素5不能为空！' }]
              })(
                <DatePicker />
              )
            }
          </Form.Item>
          <div className={styles.btnArea}>
            <Button htmlType="submit" onClick={this.onAntSubmit}>提交</Button>
            <Button onClick={this.onAntReset}>重置</Button>
          </div>
        </Form>
      </div>
    );
  }
}

@inject('store')
@observer
class ElFormExample extends Component {

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
      { required: true, message: '表单元素4不能为空！', type: 'array' }
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

    return (
      <div className={styles.formExample}>
        <h2>Element-React 表单验证示例</h2>
        <ElForm model={formExample.formModel} rules={this.rules} ref="form" labelWidth="100">
          <ElForm.Item label="表单元素1" prop="formEl1">
            <ElInput value={formExample.elInputValue} onChange={value => formExample.setElInputValue(value)} />
          </ElForm.Item>
          <ElForm.Item label="表单元素2" prop="formEl2">
            <ElSelect placeholder="请选择" value={formExample.elSelectValue} onChange={value => formExample.setElSelectValue(value)}>
              <ElSelect.Option label="测试数据1" value="1"></ElSelect.Option>
              <ElSelect.Option label="测试数据2" value="2"></ElSelect.Option>
              <ElSelect.Option label="测试数据3" value="3"></ElSelect.Option>
            </ElSelect>
          </ElForm.Item>
          <ElForm.Item label="表单元素3" prop="formEl3">
            <ElRadio.Group value={formExample.elRadioValue} onChange={value => formExample.setElRadioValue(value)}>
              <ElRadio value="1">选项1</ElRadio>
              <ElRadio value="2">选项2</ElRadio>
              <ElRadio value="3">选项3</ElRadio>
            </ElRadio.Group>
          </ElForm.Item>
          <ElForm.Item label="表单元素4" prop="formEl4">
            <ElCheckbox.Group value={formExample.elCheckboxValue} onChange={value => formExample.setElCheckboxValue(value)}>
              <ElCheckbox label="1">Option A</ElCheckbox>
              <ElCheckbox label="2">Option B</ElCheckbox>
              <ElCheckbox label="3">Option C</ElCheckbox>
            </ElCheckbox.Group>
          </ElForm.Item>
          <ElForm.Item label="表单元素5" prop="formEl5">
            <ElDatePicker placeholder="选择日期" value={formExample.elDate} onChange={value => formExample.setElDate(value)} />
          </ElForm.Item>
        </ElForm>
        <div className={styles.btnArea}>
          <Button htmlType="submit" onClick={this.onElSubmit}>提交</Button>
          <Button onClick={this.onElReset}>重置</Button>
        </div>
      </div>
    );
  }
}