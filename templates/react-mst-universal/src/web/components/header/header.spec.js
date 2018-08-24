import React from 'react';
import { mount } from 'enzyme';
import Header from './header';
import RootStore from '../../../stores/rootStore';
const store = RootStore.create({});

describe('components/header', () => {
  it('default', () => {
    let app = mount(<Header store={store} />);
    expect(app.find('.site-header')).toHaveLength(1);
    expect(app.find('.site-nav').find('li').at(0).hasClass('cur')).toBe(true);
  });
});
