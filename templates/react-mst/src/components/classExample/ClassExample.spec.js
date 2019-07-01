import React from 'react';
import { mount } from 'enzyme';
import ClassExample from './ClassExample';
import RootStore from '@/stores/root.mst';
const store = RootStore.create({});

describe('components/classExample', () => {
  it('default', () => {
    let app = mount(<ClassExample store={store} />);
    app
      .find('div')
      .at(0)
      .simulate('click');
    expect(app.find('input')).toHaveLength(1);
  });
});
