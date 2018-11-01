import cloneDeep from 'lodash/clonedeep';
import merge from 'lodash/merge';
import { ConfigMQCanlendar, ConfigMQVisualMap, ConfigChart } from '../config/chart';

export function ParseFloatString(val) {
  let ret = '0';
  val = parseFloat(val);
  if (typeof val === 'number' && !isNaN(val)) {
    ret = val.toFixed(2);
  }
  return ret;
}

export function analytics(userInfo) {
  var str = window.location.href;
  str = str.substring(str.lastIndexOf('#') + 2, str.length);
  str = str.length > 0 ? str : 'home';
  // console.log('analytics', str, userInfo);
  $al(
    {
      app: 'ril-mobile',
      version: '1.0',
      loginUser: userInfo.name || '',
      login_ip: '',
      funcPath: `ril.jd.${str}.view`
    },
    true
  ).initGather();
}

//获取DPR
export function GetDevicePixelRatio() {
  let ratio = 1;
  // To account for zoom, change to use deviceXDPI instead of systemXDPI
  if (
    window.screen.systemXDPI !== undefined &&
    window.screen.logicalXDPI !== undefined &&
    window.screen.systemXDPI > window.screen.logicalXDPI
  ) {
    // Only allow for values > 1
    ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
  } else if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  }
  return ratio;
}

export function GetChartOptionWithBase(opt) {
  const option = cloneDeep(ConfigChart);
  merge(option.baseOption, opt);
  if (opt.calendar) {
    option.media[1].option.calendar = ConfigMQCanlendar;
    option.media[1].option.visualMap = ConfigMQVisualMap;
  }
  return option;
}

export function GetDeviceHeight(def) {
  return parseInt(((document.body.clientHeight || def || 210) / 100) * 60 + '');
}
