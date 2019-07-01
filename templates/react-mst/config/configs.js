module.exports = {
  dev: {
    host: 'localhost',
    port: 8080
  },

  proxy: {
    protocol: 'http',
    host: 'localhost',
    port: 8088
  },

  mock: {
    protocol: 'http',
    host: 'localhost',
    port: 8089
  },

  lessModifyVars: {},

  e2e: {
    timeout: 30000,
    pageTimeout: 3000
  }
};
