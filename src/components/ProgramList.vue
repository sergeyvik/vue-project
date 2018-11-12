<template>
  <div>
    <h3>{{ msg }} {{ ver }}</h3>
    <div class="d-flex flex-wrap">
      <div class="test col-12 col-sm-6 col-md-3 b-col-lg-4 col-xl-2" v-for="channel in channels" :key="channel.channel_id">
        <div class="channel">
          <div class="channel_ico">
            <img :src="channel.channel_icon" alt="Значок телеканала отсутствует">
          </div>
          <div class="channel_name">
            <p>{{channel.channel_name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgramList',
  data () {
    return {
      msg: 'Welcome to Program List',
      ver: require('../../package').version,
      channels: require('../tvp_cha00s.json'),
      programs: require('../tvp_pro00s.json')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 , h3{
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
.list {
  display: flex;
  flex-wrap: wrap;
}
.channel {
  box-sizing: border-box;
  border-radius: 10px;
  background: gold;
  border: 1px solid red;
  display: flex;
  align-self: stretch;
}
.channel_name {
  margin: 10px;
  border: 1px solid black;
}
.channel_ico {
  margin: 10px;
  border: 1px solid black;
}
.test {
  background: blue;
  margin: 5px 0px;
  display: flex;
  border: 1px solid greenyellow;
}
a {
  color: #42b983;
}
</style>
