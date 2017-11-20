import nj, { registerFilter } from 'nornj';
import { toJS } from 'mobx';
import { outputMoney } from 'flarej/lib/utils/math';
import { mediaQuery } from 'flarej/lib/utils/page';

registerFilter({
  percent: (v, bit) => {
    if (v != null) {
      v = v * 100;

      v = v.toFixed(!(bit && bit._njOpts) ? bit : 0);
      return v + '%';
    }
  },
  toJS: v => toJS(v),
  thousands: (v, bit) => {
    if (v == null) {
      v = 0;
    }
    return outputMoney(+v, !(bit && bit._njOpts) ? bit : 0);
  },
  percentOrder: (v, bit) => {
    if (v != null && v != '-') {
      v = v * 100;

      v = v.toFixed(!(bit && bit._njOpts) ? bit : 0);
      return v + '%';
    }
    if (v == '-') return v;
  },
  toFixed: (v, bit) => {
    if (v != null && v != '-') {

      if (!(bit && bit._njOpts)) {
        v = (v / bit).toFixed(2);
      } else {
        v = v.toFixed(2);
      }
      return v;
    }
    if (v == '-') return v;
  },
  parseMillion: (val, noThousands) => {
    if (val == null) {
      return 0;
    }

    let fmt = 0;
    val = parseFloat(val);
    if (typeof val == 'number' && !isNaN(val)) {
      fmt = val / 10000;
    }

    const bit = val >= 100 ? 2 : 4;
    return (noThousands && !noThousands._njOpts) ? fmt.toFixed(bit) : nj.filters.thousands(fmt, bit);
  },
  parseInt: v => parseInt(v),
  clipText: (v, len) => {
    if (v == null) {
      return '';
    }

    return (v.length > len && mediaQuery('(max-width: 1400px)')) ? v.substr(0, len) + '...' : v;
  }
});