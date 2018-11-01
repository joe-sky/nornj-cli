import React from 'react';
import { mount } from 'enzyme';
import #{componentName | pascal}# from './#{componentName | pascal}#';
import RootStore from '../../../stores/rootStore';
const store = RootStore.create({});

describe('components/#{componentName}#', () => {
  it('default', () => {
    let app = mount(<#{componentName | pascal}# store={store} />);
    app.instance().wrappedInstance.editing = true;
    app.update();
    expect(app.find('input')).toHaveLength(1);
  });
});
