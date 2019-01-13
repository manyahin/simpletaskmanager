<template>
  <section class="task">
    <h2>{{ task.title }}</h2>
    <span>Subtasks: {{ completedSubTasks }} / {{ totalSubTasks }}</span>
    <ul>
      <li v-for="subTask in task.subTasks" :key="subTask.id">
        <p-check class="p-svg p-curve" color="success" v-model="subTask.completed" @change="completeSubTask(subTask)">
          <svg slot="extra" class="svg svg-icon" viewBox="0 0 20 20">
              <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                    style="stroke: white;fill:white"></path>
          </svg>
          <label>{{ subTask.title }}</label>
        </p-check>
        <div class="delete_subtask" @click="removeSubTask(subTask)">
          <img src="./assets/cross.png" alt="delete sub task">  
        </div>
      </li>
    </ul>
    <input autofocus autocomplete="off" placeholder="What sub task?" v-model="newSubTask" @keyup.enter="addSubTask">
    <p><router-link to="/">← All tasks</router-link></p>
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
        completed: subTask.completed
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
  border-bottom: 1px solid lightgrey;
}

li:last-child {
  border-bottom: none;
}

li:hover > .delete_subtask {
  display: inline-block;
}

.delete_subtask {
  display: none;
  cursor: pointer;
  float: right;
  padding: 3px;
}

.delete_subtask img {
  width: 16px;
  height: 16px;
}

.pretty .state label {
  text-indent: 0.3em !important;
}
</style>
