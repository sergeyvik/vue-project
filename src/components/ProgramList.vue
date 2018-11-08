<template>
  <div>
    <h1>{{ msg }} {{ ver }}</h1>
    <p>{{channels[50].channel_id}}</p>
    <p>{{programs[50].program_name}}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Program List',
      ver: require('../../package').version,
      channels: require('../tvp_cha00.json'),
      programs: require('../tvp_pro00.json')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
