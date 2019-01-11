'use strict';

module.exports = function(app) {
  const ds = app.dataSources.mysql;
  ds.autoupdate();
};
