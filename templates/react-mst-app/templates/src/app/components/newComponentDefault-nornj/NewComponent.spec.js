import React from 'react';
import nj, { template as t } from 'nornj';
import { mount } from 'enzyme';
import './#{componentName | pascal}#';
import RootStore from '../../../stores/rootStore';
const store = RootStore.create({});

describe('components/#{componentName}#', () => {
  it('default', () => {
    let app = mount(t`<#{componentName | pascal}# store=${store} />`);
    app.instance().wrappedInstance.editing = true;
    app.update();
    expect(app.find('input')).toHaveLength(1);
  });
});
