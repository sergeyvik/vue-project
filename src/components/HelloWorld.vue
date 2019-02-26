<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
      <input :value="num">

    <h2>Essential Links  dd2</h2>
    <program-list></program-list>
  </div>
</template>

<script>
import ProgramList from './ProgramList';
export default {
  name: 'HelloWorld',
  components: {ProgramList},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      num: 78890768
    };
  }
};
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
