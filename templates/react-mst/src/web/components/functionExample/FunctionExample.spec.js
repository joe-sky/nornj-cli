import React from 'react';
import { mount } from 'enzyme';
import FunctionExample from './FunctionExample';
import RootStore from '../../../stores/rootStore';
const store = RootStore.create({});

describe('components/functionExample', () => {
  it('default', () => {
    let app = mount(<FunctionExample store={store} />);
    app.instance().wrappedInstance.editing = true;
    app.update();
    expect(app.find('input')).toHaveLength(1);
  });
});
