import React from 'react';
import { mount } from 'enzyme';
import Header from './Header';
import RootStore from '@/stores/root.mst';
const store = RootStore.create({});

describe('components/header', () => {
  it('default', () => {
    let app = mount(<Header store={store} />);
    expect(app.find('.site-header')).toHaveLength(1);
    expect(
      app
        .find('.site-nav')
        .find('li')
        .at(0)
        .hasClass('cur')
    ).toBe(true);
  });
});
