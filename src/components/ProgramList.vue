<template>
  <div>
    <h3>{{ msg }} {{ ver }}</h3>
    <p>channels[0].channel_name {{channels[0].channel_name}}</p>>
    <div class="d-flex flex-wrap">
      <div class="test col-12 col-sm-6 col-md-3 b-col-lg-4 col-xl-2" v-for="channel in channels" :key="channel.channel_id">
        <div class="flex-column">
          <div class="channel_ico">
            <img :src="channel.channel_icon" alt="Значок телеканала отсутствует">
            channel.channel_id = {{channel.channel_id}}
          </div>
          <div>
            <p v-if="programBegin">{{channel}}</p>
            <p v-else>Нет</p>
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
  props: ['channels'],
  data () {
    return {
      msg: 'Welcome to Program List',
      ver: require('../../package').version,
      channels1: require('../tvp_00.json')
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
.flex {
  display: flex;
  flex-wrap: wrap;
}
.d-flex {

}

.channel {
  box-sizing: border-box;
  border-radius: 10px;
  background: gold;
  border: 1px solid red;
  display: flex;
}
channel_name {
  margin: 10px;
  border: 1px solid black;
}
channel_ico {
  margin: 10px;
  border: 1px solid black;
}
.test {
  background: burlywood;
  display: flex;
  border: 1px solid greenyellow;
}
a {
  color: #42b983;
}
</style>
