<template>
  <div>
    <input type="color" v-model="color">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">ТВ Программа</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"><img src="../assets/pitivi.png" alt="logo" style="width:40px;"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" :to="'/fast'">Сейчас в эфире</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="'/list'">Программа ТВ</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="'/programs'">Программа ТВ</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="'/settings'">Настройки</router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div>
      <b-button-toolbar key-nav  aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <b-btn variant="outline-primary" size="sm">&laquo;</b-btn>
          <b-btn variant="outline-primary" size="sm">&lsaquo;</b-btn>
        </b-button-group>
        <b-button-group class="mx-1">
          <b-btn variant="outline-primary" size="sm">Edit</b-btn>
          <b-btn variant="outline-primary" size="sm">Undo</b-btn>
          <b-btn variant="outline-primary" size="sm">Redo</b-btn>
        </b-button-group>
        <b-button-group class="mx-1">
          <b-btn variant="outline-primary" size="sm">&rsaquo;</b-btn>
          <b-btn variant="outline-primary" size="sm">&raquo;</b-btn>
        </b-button-group>
      </b-button-toolbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      color: '#e66465'
    };
  },
  watch: {
    color (val) {
      alert(val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
