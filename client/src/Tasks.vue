<template>
  <div>
    <section class="tasks">
      <ul>
        <li v-for="task in filteredTasks" :key="task.id">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="task.completed">
            <router-link :to="'/task/' + task.id">{{ task.title }}</router-link>
            <button class="destroy" @click="removeTask(task)">x</button>
          </div>
        </li>
      </ul>
      <input class="new-todo" autofocus autocomplete="off" placeholder="What task?" v-model="newTask" @keyup.enter="addTask">
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
      visibility: 'all',
      newTask: ''
    }
  },
  mounted () {
    fetch('http://localhost:3000/api/Tasks')
      .then(res => res.json())
      .then(data => this.tasks = data)
  },
  methods: {
    addTask: function () {
      var value = this.newTask && this.newTask.trim();
      if (!value) {
        return;
      }

      let newTaskObj = { title: value, completed: false }
      
      fetch('http://localhost:3000/api/Tasks', {
        method: 'POST',
        body: JSON.stringify(newTaskObj),
        headers:{
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(task => {
          this.tasks.push(task);
        })

      this.newTask = '';
    },
    removeTask: function (task) {
      var index = this.tasks.indexOf(task);

      fetch('http://localhost:3000/api/Tasks/' + task.id, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(({count}) => {
          this.tasks.splice(index, 1);
        })
    },
  },
  computed: {
    filteredTasks: function () {
      console.log(this.$route)
      return filters[this.visibility](this.tasks);
    }
  }
}
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  /*display: inline-block;*/
  margin: 0 10px;
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
</style>
