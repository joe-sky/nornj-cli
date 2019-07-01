import React from 'react';
import { mount } from 'enzyme';
import FunctionExample from './FunctionExample';
import RootStore from '@/stores/root.mst';
const store = RootStore.create({});

describe('components/functionExample', () => {
  it('default', () => {
    let app = mount(<FunctionExample store={store} />);
    app
      .find('div')
      .at(0)
      .simulate('click');
    expect(app.find('input')).toHaveLength(1);
  });
});
