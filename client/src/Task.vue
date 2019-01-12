<template>
  <section class="task">
    <span>Subtasks {{ completedSubTasks }} / {{ totalSubTasks }}</span>
    <ul>
      <li v-for="subTask in subTasks" :key="subTask.id">
        <input type="checkbox" v-model="subTask.completed" @click="completeSubTask(subTask)">
        <label>{{ subTask.title }}</label>
        <button @click="removeSubTask(subTask)">x</button>
      </li>
    </ul>
    <input autofocus autocomplete="off" placeholder="What task?" v-model="newSubTask" @keyup.enter="addSubTask">
    <router-link to="/">Home</router-link>  
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Task',
  data () {
    return {
      taskId: this.$route.params.id,
      subTasks: [],
      newSubTask: ''
    }
  },
  mounted () {
    const filter = {
      where: {
        taskId: this.taskId  
      }
    }
    axios.get('SubTasks?filter=' + JSON.stringify(filter))
      .then(({data}) => this.subTasks = data)
  },
  methods: {
    addSubTask () {
      axios.post('SubTasks', {
        taskId: this.taskId,
        title: this.newSubTask,
        completed: false
      })
        .then(({data}) => {
          this.subTasks.push(data)
          this.newSubTask = ''
        })
        .catch(err => console.log(err))
    },
    removeSubTask (subTask) {
      const index = this.subTasks.indexOf(subTask);

      axios.delete('SubTasks/' + subTask.id)
        .then(res => {
          this.subTasks.splice(index, 1);
        })
        .catch(err => console.log(err))
    },
    completeSubTask (subTask) {
      axios.patch('SubTasks/' + subTask.id, {
        completed: !subTask.completed
      })
        .catch(error => console.log(error))
    }
  },
  computed: {
    totalSubTasks () {
      return this.subTasks.length
    },
    completedSubTasks () {
      return this.subTasks.filter(subTask => subTask.completed).length
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 5px;
  margin-bottom: 5px;
}
</style>
