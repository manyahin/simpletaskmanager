'use strict';

module.exports = function(app) {
  // const task_schema = app.models.Task.definition;
  // const subtask_schema = app.models.SubTask.definition;

  const ds = app.dataSources.mysql;

  // ds.createModel(task_schema.name, task_schema.properties, task_schema.options);
  // ds.createModel(subtask_schema.name, subtask_schema.properties, subtask_schema.options);

  ds.automigrate();
};
