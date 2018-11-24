<template>
  <div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in channels" :key="channel.channel_id">
          <div class="channel_header">
            <div class="channel_ico"> <img :src="channel.channel_icon" alt="Значок телеканала отсутствует"></div>
            <div class="channel_name">{{channel.channel_name}}</div>
          </div>
          <div class="channel_text" v-for="program in channel.programs" :key="program.program_start">
            <div class="channel_time">{{timeConverter(program.program_start)}}</div>
            <div> {{program.program_name}}</div>
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
  font-size: small;
}
.list {
  display: flex;
  flex-wrap: wrap;
}
.card {
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.channel_header {
  display: flex;
}
.channel_ico {
}
.channel_name {
  display: flex;
  font-size: small;
  font-weight: bold;
  align-self: center;
  justify-content: center;
  flex-grow: 1;
}
.channel_time {
  padding-right: 5px;
}
.channel_text {
  display: flex;
}
img {
  padding-right: 5px;
}
</style>
