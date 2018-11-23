<template>
  <div>
    <div class="d-flex flex-wrap">
      <div class="channel col-12 col-sm-6 col-md-3 b-col-lg-4 col-xl-2" v-for="channel in channels" :key="channel.channel_id">
        <div class="flex-column flex-wrap">
          <div class="channel_header">
            <div class="channel_ico><img :src="channel.channel_icon" alt="Значок телеканала отсутствует"></div>
            <div class="channel_name">{{'' + channel.channel_name}}</div>
          </div>
          <div class="channel_text" v-for="program in channel.programs" :key="program.program_start">
            <div class="channel_time">{{timeConverter(program.program_start)}}</div>
            <div v-if="program.program_description !== undefined">{{program.program_name}} <br> {{program.program_description}}</div>
            <div v-else>{{program.program_name}}</div>
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
  },
  methods: {
    timeConverter: function (parameters) {
      let date = new Date(parameters)
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10) ? ('0' + date.getMinutes()) : date.getMinutes())
      return time
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
div {
  font-family: Arial, Helvetica, sans-serif;
  font-size: x-small;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
.channel_text {
  display: flex;
}

.channel_time {
  padding-right: 5px;
}
.channel {
  box-sizing: border-box;
  border-radius: 10px;
  background: gold;
  border: 1px solid red;
  display: flex;
}
.channel_name {
  margin: 5px;
  font-size: small;
  font-weight: bold;
  text-align: center;
}
.channel_ico {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 60px;
}
img {
  padding-right: 5px;
}
a {
  color: #42b983;
}
</style>
