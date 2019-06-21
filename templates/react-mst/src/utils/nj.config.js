import nj, { registerFilter, registerExtension } from 'nornj';
import 'nornj-react/mobx';
import 'nornj-react/router';
import React from 'react';
import intl from 'react-intl-universal';
nj.filterConfig.currency.symbol = '';

registerFilter({
  percent: (v, bit = 0) => {
    if (v != null) {
      v = v * 100;

      v = v.toFixed(bit);
      return v + '%';
    }
  },

  percentOrder: (v, bit = 0) => {
    if (v != null && v != '-') {
      v = v * 100;

      v = v.toFixed(bit);
      return v + '%';
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
    return noThousands ? fmt.toFixed(bit) : n`${fmt} | currency(${bit})`;
  },

  intl: function(...args) {
    return intl.get(...args);
  }
});

function FieldWrap({ FieldTag, fieldDirectiveOptions, children, ...props }) {
  const {
    props: directiveProps,
    context: { $this },
    value
  } = fieldDirectiveOptions;

  return (
    <FieldTag {...props}>
      {$this.props.form.getFieldDecorator(n`${directiveProps}.arguments[0].name`, value())(children)}
    </FieldTag>
  );
}

registerExtension('field', options => {
  const { tagName, setTagName, tagProps } = options;

  setTagName(FieldWrap);
  tagProps.FieldTag = tagName;
  tagProps.fieldDirectiveOptions = options;
});

registerExtension('fieldSpan', options => {
  const { tagProps, props } = options;
  const span = +(n`${props}.arguments[0].name` || 4);
  tagProps.labelCol = {
    span
  };
  tagProps.wrapperCol = {
    span: 24 - span
  };
});
