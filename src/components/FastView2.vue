<template>
  <div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in currentProgram"
           :key="channel.channel_id">
        <div class="card_header">
          <div class="channel_ico">
            <img v-if="channel.channel_icon !== undefined" :src="channel.channel_icon" alt="Знак ТВ">
            <img v-else src="../assets/icon_tv.png" alt="Знак ТВ">
          </div>
          <div class="channel_header">
            <div class="channel_name">{{channel.channel_name}}</div>
            <div>{{timeConverter(channel.program_start)}}  -  {{timeConverter(channel.program_end)}}</div>
            <div>{{channel.program_name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FastView',
  props: ['channels', 'now'],
  data () {
    return {
      currentProgramList: []
    }
  },
  methods: {
    timeConverter: function (parameters) {
      let date = new Date(parameters)
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10)
        ? ('0' + date.getMinutes()) : date.getMinutes())
      return time
    }
  },
  computed: {
    currentProgram () {
      let result = []
      for (let channel of this.channels) {
        let data = {}
        for (let program of channel.programs) {
          if (program.program_start <= this.now && program.program_end > this.now) {
            data.channel_id = channel.channel_id
            data.channel_icon = channel.channel_icon
            data.channel_name = channel.channel_name
            data.program_start = program.program_start
            data.program_end = program.program_end
            data.program_name = program.program_name
            data.program_description = program.program_description
            data.program_category = program.program_category
            data.program_rating = program.program_rating
            break
          }
        }
        result.push(data)
      }
      return result
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    font-family: Arial, Helvetica, sans-serif;
    font-size: small;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
  }
  .card {
    display: flex;
  }
  .card_header {
    display: flex;
  }
  .channel_ico {
  }
  .channel_header {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .channel_name {
    display: flex;
    font-size: small;
    font-weight: bold;
    justify-content: center;
  }

</style>
