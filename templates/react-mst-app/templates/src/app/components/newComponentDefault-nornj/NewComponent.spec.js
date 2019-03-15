import React from 'react';
import nj, { template as t } from 'nornj';
import { mount } from 'enzyme';
import './#{componentName | capitalize}#';
import RootStore from '../../../stores/rootStore';
const store = RootStore.create({});

describe('components/#{componentName}#', () => {
  it('default', () => {
    let app = mount(t`<#{componentName | capitalize}# store=${store} />`);
    app.instance().wrappedInstance.editing = true;
    app.update();
    expect(app.find('input')).toHaveLength(1);
  });
});
