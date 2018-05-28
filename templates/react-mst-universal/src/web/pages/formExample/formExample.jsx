import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj, {
  mustache as m,
  css as s
} from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Cascader,
  DatePicker,
  Checkbox
} from 'antd';
import styles from './formExample.m.scss';

// 页面容器组件
@registerTmpl('FormExample')
@inject('store')
@observer
export default class FormExample extends Component {
  render() {
    const { store: { formExample } } = this.props;

    return (
      <AntFormExample />
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
              inputValue：<i style={s`color:purple`}>{this.inputValue}</i>
            </div>
          </div>
          <div className={styles.formEls}>
            <Input.TextArea value={this.textareaValue} onChange={e => this.textareaValue = e.target.value} />
            <div>
              textareaValue：<i style={s`color:purple`}>{this.textareaValue}</i>
            </div>
          </div>
          <div className={styles.formEls}>
            <Select value={this.selectValue} onChange={value => this.selectValue = value} style={{ width: '100%' }} placeholder="请选择">
              <Select.Option value="1">测试数据1</Select.Option>
              <Select.Option value="2">测试数据2</Select.Option>
              <Select.Option value="3">测试数据3</Select.Option>
            </Select>
            <div>
              selectValue：<i style={s`color:purple`}>{this.selectValue}</i>
            </div>
          </div>
          <div className={styles.formEls}>
            <Checkbox.Group value={toJS(this.checkboxValue)} onChange={value => this.checkboxValue = value}>
              <Checkbox value="1">Option A</Checkbox>
              <Checkbox value="2">Option B</Checkbox>
              <Checkbox value="3">Option C</Checkbox>
            </Checkbox.Group>
            <div>
              checkboxValue：<i style={s`color:purple`}>{this.checkboxValue}</i>
            </div>
          </div>
        </div>
        <h2>Ant Design 表单验证示例</h2>
        <Form>
          <Form.Item label="表单元素1" {...m`formItemParams(3)`}>
            {
              this.props.form.getFieldDecorator('formEl1', {
                initialValue: formExample.antInputValue,
                rules: [{ required: true, message: '表单元素1不能为空！' }]
              })(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item label="表单元素2" {...m`formItemParams(3)`}>
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
          <Form.Item label="表单元素3" {...m`formItemParams(3)`}>
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
          <Form.Item label="表单元素4" {...m`formItemParams(3)`}>
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
          <Form.Item label="表单元素5" {...m`formItemParams(3)`}>
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