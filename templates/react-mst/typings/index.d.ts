import RootStore from '@/stores/root.mst';
import { AxiosResponse } from 'axios';
import 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';

declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */

  interface IProps {
    store?: typeof RootStore.Type;
    form?: WrappedFormUtils;
  }

  interface IServiceData<T = any> {
    data: T;
    message?: string;
    total?: number;
    success: boolean;
  }

  type ServiceResponse = AxiosResponse<IServiceData>;

  declare const __HOST;
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {  // eslint-disable-line
    jsx?: boolean;
    global?: boolean;
  }
}
