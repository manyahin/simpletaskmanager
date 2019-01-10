<template>
  <section class="task">
    <ul>
      <li v-for="subTask in subTasks" :key="subTask.id">
        <input type="checkbox" v-model="subTask.completed">
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
        .then(({data}) => this.subTasks.push(data))
        .catch(err => console.log(err))
    },
    removeSubTask (subTask) {
      const index = this.subTasks.indexOf(subTask);

      axios.delete('SubTasks/' + subTask.id)
        .then(res => {
          this.subTasks.splice(index, 1);
        })
        .catch(err => console.log(err))
    }
  }
}
</script>