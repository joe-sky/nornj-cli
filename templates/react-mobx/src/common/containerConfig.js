import 'flarej/vendor/normalize.less';
import 'flarej/lib/styles/grid';
import 'flarej/lib/components/grid';
import '../../resources/styles/base.less';
import { toJS } from 'mobx';
import nj, { registerFilter, registerExtension } from 'nornj';
import 'nornj-react/mobx';

registerFilter('toJS', (v) => {
  return toJS(v);
});

registerExtension({
  cif: {
    extension: function(prop, options) {
      return nj.extensions.if.call(this, prop, options);
    },
    options: nj.extensionConfig.if
  },
  celseif: {
    extension: function(prop, options) {
      return nj.extensions.elseif.call(this, prop, options);
    },
    options: nj.extensionConfig.elseif
  },
  celse: {
    extension: options => options.subExProps['else'] = options.result,
    options: nj.extensionConfig.else
  }
});