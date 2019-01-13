<template>
  <div >
    <h1>Todo list</h1>
    <div class="items_left">{{ tasksLeft }} Items left</div>
    <section class="tasks">
      <ul>
        <li class="task" v-for="task in filteredTasks" :key="task.id">
          <p-check class="p-svg p-curve" color="success" v-model="task.completed" @change="completeTask(task)">
            <svg slot="extra" class="svg svg-icon" viewBox="0 0 20 20">
                <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                      style="stroke: white;fill:white"></path>
            </svg>
          </p-check>
          <router-link :to="'/task/' + task.id">{{ task.title }}</router-link>
          <!-- <button class="destroy" @click="removeTask(task)">x</button> -->
          <span class="subtasks_count">{{ task.subTasks.filter(subTask => subTask.completed).length }} / {{ task.subTasks.length }}</span>
          <div class="actions">
            <div class="delete_task" @click="removeTask(task)">
              <img src="./assets/cross.png" alt="delete task">  
            </div>
          </div>
        </li>
      </ul>
      <label>New task:</label>
      <input class="new_task" autofocus autocomplete="off" placeholder="Title" v-model="newTask" @keyup.enter="addTask">
    </section>
    <footer>
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
      const self = this
      var value = this.newTask && this.newTask.trim();
      if (!value) {
        return;
      }

      axios.post('Tasks', { title: value, completed: false })
        .then(({data}) => {
          data.subTasks = [];
          this.tasks.push(data);
          this.newTask = '';
        })
        .catch(error => {
          if (error.response.status == 422) {
            self.$notify({
              group: 'main',
              type: 'error',
              title: 'Dublicate task title',
              text: 'The task with same title already exists, choose another one.'
            })
          }
          console.log(error)
        })
    },
    removeTask: function (task) {
      var index = this.tasks.indexOf(task);

      if (window.confirm("Are you sure? Task \"" + task.title + "\" will be deleted with all related subtasks.")) {
        axios.delete('Tasks/' + task.id)
          .then(({count}) => {
            this.tasks.splice(index, 1);
          })
      }
    },
    completeTask: function(task) {
      // console.log(task.completed)
      axios.patch('Tasks/' + task.id, {
        completed: task.completed
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

li.task:hover > .actions {
  display: inline-block;
}

.actions {
  float: right;
  display: none;
}

.actions .delete_task {
  cursor: pointer;
  float: right;
  padding: 4px 1px;
  opacity: 0.7;
}

.actions .delete_task img {
  width: 16px;
  height: 16px;
}

li.task a {
  font-size: 17px;
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
  margin: 0;
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

.new_task {
  padding: 3px;
  margin-left: 3px;
}

footer {
  margin-top: 15px;
}
</style>
