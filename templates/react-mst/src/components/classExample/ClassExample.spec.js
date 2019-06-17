import React from 'react';
import { mount } from 'enzyme';
import ClassExample from './ClassExample';
import RootStore from '../../stores/root.mst';
const store = RootStore.create({});

describe('components/classExample', () => {
  it('default', () => {
    let app = mount(<ClassExample store={store} />);
    app.instance().wrappedInstance.editing = true;
    app.update();
    expect(app.find('input')).toHaveLength(1);
  });
});
