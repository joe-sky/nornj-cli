import React from 'react';
import { mount } from 'enzyme';
import Sider from './Sider';
import RootStore from '@/stores/root.mst';
const store = RootStore.create({});

jest.mock('react-router-dom', () => ({
  Link: props => <a>{props.children}</a>
}));

describe('components/sider', () => {
  it('default', () => {
    let app = mount(<Sider store={store} />);
    expect(app.find('.bm-menu-wrap')).toHaveLength(1);
    app
      .find('.bm-cross-button button')
      .at(0)
      .simulate('click');
    expect(store.sider.isOpen).toBe(false);
  });
});
