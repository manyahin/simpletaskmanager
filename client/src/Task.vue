<template>
  <section class="task">
    <ul>
      <li v-for="subTask in subTasks">
        <input type="checkbox" v-model="subTask.completed">
        <label>{{ subTask.title }}</label>
        <button>x</button>
      </li>
    </ul>
    <router-link to="/">Home</router-link>  
  </section>
</template>

<script>
export default {
  name: 'Task',
  data () {
    return {
      subTasks: []
    }
  },
  mounted () {
    const taskId = this.$route.params.id;

    fetch('http://localhost:3000/api/SubTasks?filter={"taskId":' + taskId + '}')
      .then(res => res.json())
      .then(data => this.subTasks = data)
  },
  methods: {

  }
}
</script>