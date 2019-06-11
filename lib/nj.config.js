const nj = require('nornj/dist/nornj.common').default;

nj.config({
  textMode: true,
  delimiters: {
    start: '{%',
    end: '%}',
    extension: '#',
    prop: '@',
    template: '#template',
    comment: '%'
  },
  fixTagName: false
});

nj.registerFilter({
  pascal: str => str[0].toUpperCase() + str.substr(1)
});

nj.registerExtension({
  headElements: () => `<% if (web) { %>
#parse("pages/common/headElements.vm")
<% } else { %>
<$include src="./common/headElements.html" />
<% } %>`,

  resourceElements: () => `  <% if (web) { %>
  #parse("pages/common/resourceElements.vm")
  <% } else { %>
  <$include src="./common/resourceElements.html" />
  <% } %>`,

  bottomElements: () => `  <% if (web) { %>
  #parse("pages/common/bottomElements.vm")
  <% } else { %>
  <$include src="./common/bottomElements.html" />
  <% } %>`
});
