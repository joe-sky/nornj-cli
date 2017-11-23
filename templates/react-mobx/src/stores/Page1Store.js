import { observable, computed, action, transaction } from 'mobx';
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import { autobind } from 'core-decorators';
import { Notification } from 'flarej/lib/components/antd/notification';

export default class Page1Store {
  @observable pageIndex = 1;
  @observable pageSize = 10;
  @observable count = 0;
  @observable tableData = [];

  @autobind
  @action
  getTableData(currentPage = this.pageIndex, pageSize = this.pageSize) {
    return fetchData(`${G_WEB_DOMAIN}/page1/getTableData`, result => {
      transaction(() => {
        if (result.success) {
          this.pageIndex = currentPage;
          this.pageSize = pageSize;
          this.count = result.totalCount;
          this.tableData = result.data;
        } else {
          this.pageIndex = 1;
          this.pageSize = 10;
          this.count = 0;
          this.tableData = [];
          Notification.error({ description: '获取表格数据出错，错误是:' + result.msg, duration: null });
        }
      });
    }, {
      currentPage,
      pageSize,
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取表格数据出错，错误是:' + ex, duration: null });
    });
  }
}