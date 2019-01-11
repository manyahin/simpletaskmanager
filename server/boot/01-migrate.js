'use strict';

module.exports = async function(app) {
  // migrate data schemes
  const ds = app.dataSources.mysql;
  await ds.autoupdate(['Task', 'SubTask']);

  // fill default data if required
  const Task = app.models.Task;
  const SubTask = app.models.SubTask;

  const defaultTasks = [
    {
      "title": "Make list view",
      "completed": true,
      "subTasks": [
        {
          "title": "write tests",
          "completed": false,
        },
        {
          "title": "check cross-browser",
          "completed": true,
        }
      ]
    },
    {
      "title": "Make detail view",
      "completed": false,
      "subTasks": [
        {
          "title": "make design",
          "completed": false,
        }
      ]
    },
    {
      "title": "Write backend code",
      "completed": false,
      "subTasks": [
        {
          "title": "prepare docker",
          "completed": false,
        }
      ]
    }
  ];

  const tasksCnt = await Task.count();
  if (tasksCnt) return;

  defaultTasks.forEach(async defTask => {
    let newTask = await Task.create(defTask);

    if (defTask.subTasks) {
      defTask.subTasks.forEach(async defSubTask => {
        defSubTask.taskId = newTask.id;
        await SubTask.create(defSubTask);
      });
    }
  })

  console.log('DB filled by mockup data');
};
