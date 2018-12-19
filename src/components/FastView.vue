<template>
  <div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in fastView"
           :key="channel.channel_id">
        <div class="card_header">
          <div class="star">
            <i :class="checkStar(channel)" @click="changeStarred(channel)"></i>
          </div>
          <div class="channel_ico">
            <img v-if="channel.channel_icon" :src="channel.channel_icon" alt="Знак ТВ">
            <img v-else src="../assets/icon_tv.png" alt="Знак ТВ">
          </div>
          <div class="channel_header">
            <div class="channel_name">{{channel.channel_name}}</div>
            <div v-if="channel.program_category" :style="{backgroundColor: checkColor(channel)}">
              {{timeConverter(channel.program_start)}}  -  {{timeConverter(channel.program_end)}}</div>
            <div v-else>{{timeConverter(channel.program_start)}}  -  {{timeConverter(channel.program_end)}}</div>
            <div class="channel_desc" v-if="channel.program_description" v-b-popover.hover="channel.program_description"
                 title="Описание">{{channel.program_name + ' '}}
                  <i :class="checkLabel(channel)" :style="{color:checkColor(channel)}"></i></div>
            <div class="channel_desc" v-else> {{channel.program_name + ' '}}
                  <i :class="checkLabel(channel)" :style="{color:checkColor(channel)}"></i></div>
            <b-progress class="progress"  height="3px" :value="now-channel.program_start"
                        :max="channel.program_end-channel.program_start"></b-progress>
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
    changeStarred (channel) {
      this.$emit('changeStarred', channel)
    },
    checkStar (channel) {
      if (channel.starred === true) {
        return 'fas fa-star'
      } else {
        return 'far fa-star'
      }
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
  img {
    width: 60px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
  }
  .card {
    display: flex;
    margin-bottom: 5px;
    padding-right: 5px;
    padding-left: 5px;
  }
  .star {
    margin-top: 5px;
    font-size: 120%;
    color: white;
  }
  .star:hover {
    color: gold;
  }
  .card_header {
    display: flex;
    height: 100%;
  }
  .channel_ico {
  }
  .channel_header {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
  }
  .channel_name {
    display: flex;
    font-size: medium;
    font-weight: bold;
    justify-content: center;
    margin: 10px 0px;
  }
  .channel_desc {
    margin-bottom: 20px;
  }
  .progress {
    position: absolute;
    width: 90%;
    bottom: 10px;
  }

</style>
