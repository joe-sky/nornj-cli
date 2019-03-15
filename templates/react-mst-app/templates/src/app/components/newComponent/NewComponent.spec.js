import React from 'react';
import { mount } from 'enzyme';
import #{componentName | capitalize}# from './#{componentName | capitalize}#';
import RootStore from '../../../stores/rootStore';
const store = RootStore.create({});

describe('components/#{componentName}#', () => {
  it('default', () => {
    let app = mount(<#{componentName | capitalize}# store={store} />);
    app.instance().wrappedInstance.editing = true;
    app.update();
    expect(app.find('input')).toHaveLength(1);
  });
});
