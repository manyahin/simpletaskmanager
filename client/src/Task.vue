<template>
  <section class="task">
    <h2>{{ task.title }}</h2>
    <span>Subtasks {{ completedSubTasks }} / {{ totalSubTasks }}</span>
    <ul>
      <li v-for="subTask in task.subTasks" :key="subTask.id">
        <input type="checkbox" v-model="subTask.completed" @click="completeSubTask(subTask)">
        <label>{{ subTask.title }}</label>
        <button @click="removeSubTask(subTask)">x</button>
      </li>
    </ul>
    <input autofocus autocomplete="off" placeholder="What task?" v-model="newSubTask" @keyup.enter="addSubTask">
    <p><router-link to="/">← Show all tasks</router-link></p>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Task',
  data () {
    return {
      taskId: this.$route.params.id,
      task: {},
      newSubTask: ''
    }
  },
  mounted () {
    const filter = {
      where: {
        id: this.taskId  
      },
      include: "subTasks"
    };
    axios.get('Tasks?filter=' + JSON.stringify(filter))
      .then(({data}) => this.task = data.pop())
  },
  methods: {
    addSubTask () {
      const self = this
      axios.post('SubTasks', {
        taskId: this.taskId,
        title: this.newSubTask,
        completed: false
      })
        .then(({data}) => {
          this.task.subTasks.push(data)
          this.newSubTask = ''
        })
        .catch(err => {
          if (err.response.status == 422) {
            self.$notify({
              group: 'main',
              type: 'error',
              title: 'Dublicate sub task title',
              text: 'The sub task with same title already exists in this task, choose another one.'
            })
          }
          console.log(err)
        })
    },
    removeSubTask (subTask) {
      const index = this.task.subTasks.indexOf(subTask);

      axios.delete('SubTasks/' + subTask.id)
        .then(res => {
          this.task.subTasks.splice(index, 1);
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
      return this.task.subTasks && 
        this.task.subTasks.length
    },
    completedSubTasks () {
      return this.task.subTasks && 
        this.task.subTasks.filter(subTask => subTask.completed).length
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
