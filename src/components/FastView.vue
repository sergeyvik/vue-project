<template>
  <div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in fastView"
           :key="channel.channel_id">
        <div class="card_header">
          <div class="channel_ico">
            <img v-if="channel.channel_icon" :src="channel.channel_icon" alt="Знак ТВ">
            <img v-else src="../assets/icon_tv.png" alt="Знак ТВ">
          </div>
          <div class="channel_header">
            <div class="channel_name">{{channel.channel_name}}</div>
            <div v-if="channel.program_category" :style="{backgroundColor: checkColor(channel)}">
              {{timeConverter(channel.program_start)}}  -  {{timeConverter(channel.program_end)}}</div>
            <div v-else>{{timeConverter(channel.program_start)}}  -  {{timeConverter(channel.program_end)}}</div>
            <div v-if="channel.program_description" v-b-popover.hover="channel.program_description" title="Описание">
              {{channel.program_name + ' '}} <i :class="checkLabel(channel)" :style="{color:checkColor(channel)}"></i></div>
            <div v-else> {{channel.program_name + ' '}} <i :class="checkLabel(channel)" :style="{color:checkColor(channel)}"></i></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FastView',
  props: ['fastView', 'now', 'category'],
  data () {
    return {
      currentProgramList: [],
      temp: []
    }
  },
  methods: {
    timeConverter: function (parameters) {
      let date = new Date(parameters)
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10)
        ? ('0' + date.getMinutes()) : date.getMinutes())
      return time
    },
    checkColor (res) {
      for (let data in this.category) {
        if (this.category[data].name === res.program_category && this.category[data].checked === true) {
          return this.category[data].color
        }
      }
      return ''
    },
    checkLabel (res) {
      for (let data in this.category) {
        if (this.category[data].name === res.program_category && this.category[data].checked === true) {
          return this.category[data].icon
        }
      }
      return ''
    }
  },
  computed: {
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
