<template>
  <div class="app">
    <div class="header"> jkdshjkfhs</div>
    <div class="menu">
      <router-link class="btn btn-primary" tag="button" :to="'/fast'">Сейчас в эфире</router-link>
      <router-link class="btn btn-primary" tag="button" :to="'/list'">Программа ТВ</router-link>
      <router-link class="btn btn-primary" tag="button" :to="'/'">Пример изначальный</router-link>
    </div>
    <div class="sidebar"></div>
    <div class="content"> <router-view/> </div>
    <div class="footer">sdfgsgfgs</div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: hotpink;
  padding: 5px;
}
.header {
  background: chocolate;
  padding: 20px;
  text-align: center;
  margin: 5px 0px;
  border-radius: 10px;
}
.footer {
  background: brown;
  padding: 20px;
  text-align: center;
  margin: 5px 0px;
  border-radius: 10px;
}
.menu {
  background: lightgoldenrodyellow;
  padding: 5px 20px;
  margin: 5px 0px;
  border-radius: 10px;
}
.content {
  background: white;
  border-radius: 10px;
}
</style>
