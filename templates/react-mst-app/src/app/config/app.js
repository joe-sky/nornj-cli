const ConfigApp = {
  home: {
    funcsPerRow: 4
  }
};

const AppFunctions = [
  {
    type: 'group',
    index: 'Menu1',
    name: '菜单1',
    expanded: false,
    children: [
      {
        type: 'item',
        link: '/ListExample',
        index: 'ListExample',
        name: '列表示例'
      },
      {
        type: 'item',
        link: '/ChartExample',
        index: 'ChartExample',
        name: '图表示例'
      }
    ]
  },
  {
    type: 'group',
    index: 'Menu2',
    name: '菜单2',
    expanded: false,
    children: [
      {
        type: 'item',
        link: '/Page3',
        index: 'Page3',
        name: '页面3',
        disabled: true
      },
      {
        type: 'item',
        link: '/Page4',
        index: 'Page4',
        name: '页面4',
        disabled: true
      }
    ]
  }
];

export { ConfigApp, AppFunctions };
