<template>
  <div>
    <section class="tasks">
      <ul>
        <li class="task" v-for="task in filteredTasks" :key="task.id">
          <input class="toggle" type="checkbox" v-model="task.completed" @click="completeTask(task)">
          <router-link :to="'/task/' + task.id">{{ task.title }}</router-link>
          <!-- <button class="destroy" @click="removeTask(task)">x</button> -->
          <span class="subtasks_count"> {{ task.subTasks.filter(subTask => subTask.completed).length }} / {{ task.subTasks.length }}</span>
        </li>
      </ul>
      <label>Add new task:</label>
      <input class="new-todo" autofocus autocomplete="off" placeholder="What task?" v-model="newTask" @keyup.enter="addTask">
    </section>
    <footer>
      <div class="items_left">{{ tasksLeft }} Items left</div>
      <span>Show:</span>
      <ul class="filters">
        <li><a href="#/all" @click="visibility = 'all'" :class="{selected: visibility == 'all'}">All</a></li>
        <li><a href="#/active" @click="visibility = 'active'" :class="{selected: visibility == 'active'}">Active</a></li>
        <li><a href="#/completed" @click="visibility = 'completed'" :class="{selected: visibility == 'completed'}">Completed</a></li>
      </ul>  
    </footer>
  </div>
</template>

<script>
import axios from 'axios'

var filters = {
  all: function (tasks) {
    return tasks;
  },
  active: function (tasks) {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  },
  completed: function (tasks) {
    return tasks.filter(function (task) {
      return task.completed;
    });
  }
};

export default {
  data () {
    return {
      tasks: [],
      visibility: this.$route.meta.visibility || 'all',
      newTask: ''
    }
  },
  mounted () {
    const filter = {"include": "subTasks"};
    axios.get('Tasks?filter=' + JSON.stringify(filter))
      .then(({data}) => this.tasks = data)
  },
  methods: {
    addTask: function () {
      var value = this.newTask && this.newTask.trim();
      if (!value) {
        return;
      }

      axios.post('Tasks', { title: value, completed: false })
        .then(({data}) => {
          data.subTasks = [];
          this.tasks.push(data);
        })
        .catch(error => console.log(error))

      this.newTask = '';
    },
    removeTask: function (task) {
      var index = this.tasks.indexOf(task);

      axios.delete('Tasks/' + task.id)
        .then(({count}) => {
          this.tasks.splice(index, 1);
        })
    },
    completeTask: function(task) {
      axios.patch('Tasks/' + task.id, {
        completed: !task.completed
      })
        .catch(error => console.log(error))
    }
  },
  computed: {
    filteredTasks: function () {
      return filters[this.visibility](this.tasks);
    },
    tasksLeft: function () {
      return this.tasks.filter(task => !task.completed).length
    }
  }
}
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
}

li.task {
  padding: 5px 5px;
  margin-bottom: 5px;
  border: 1px solid lightgrey;
  border-bottom: 1px solid grey;
  border-right: 1px solid grey;
}

li.task a {
  font-size: 18px;
  text-decoration: none;
  padding: 0 4px;
}

li.task span.subtasks_count {
  float: right;
  margin: 3px 10px;
  font-size: 14px;
}

ul.filters {
  display: inline-block;
}

ul.filters li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

a.selected {
  text-decoration: none;
}

.items_left {
  margin: 10px 0px;
}
</style>
