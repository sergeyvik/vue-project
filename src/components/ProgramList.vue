<template>
  <div>
    <div class="dateList">
      <div class="date" v-for="(date, key) in dateList" :key="key">
        <b-button :pressed="key === pressed" @click="changeDataInPL(key, dateList[key])"
                  variant="outline-primary" size="sm">
          {{date.day+'.'+date.month+' '+getDayName(date.name)}} <b-badge v-if="key===pressed" variant="light">
          {{'за '+timeForSample.name}}</b-badge>
        </b-button>
        <b-dropdown v-if="key===pressed" :pressed="true" right size="sm" variant="primary">
          <b-dropdown-item @click="changeTimeInPL(timeList[0])"><span>утро  05.00-12.00</span></b-dropdown-item>
          <b-dropdown-item @click="changeTimeInPL(timeList[1])"><span>день  12.00-18.00</span></b-dropdown-item>
          <b-dropdown-item @click="changeTimeInPL(timeList[2])"><span>вечер 18.00-24.00</span></b-dropdown-item>
          <b-dropdown-item @click="changeTimeInPL(timeList[3])"><span>ночь  00.00-05.00</span></b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="changeTimeInPL(timeList[4])"><span>сутки 00.00-24.00</span></b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in channels"
           :key="channel.channel_id">
          <div class="channel_header">
            <div class="star" :class="{star_active: channel.starred}">
              <i class="fa-star" :class="[channel.starred?'fas':'far']" @click="changeStarred(channel)"></i>
            </div>
            <img v-if="channel.channel_icon" :src="channel.channel_icon" alt="Знак ТВ">
            <img v-else src="../assets/icon_tv.png" alt="Знак ТВ">
            <div class="channel_name">{{channel.channel_name}}</div>
            <div class="eye" :class="{eye_active: channel.starred}">
              <i class="fa-eye-slash" :class="[channel.hidden?'fas':'far']" @click="changeHidden(channel)"></i>
            </div>
          </div>
          <div class="channel_text" :class="{past: now>program.program_end, current: now>program.program_start
           && now<program.program_end}" v-for="program in channel.programs" :key="program.program_start">
            <div class = "bell" :class="{bell_active: program.reminder}">
              <i class="fa-bell" :class="[program.reminder?'fas':'far']" @click="changeReminder(channel, program)"></i>
            </div>
            <div v-if="program.program_category" :style="{backgroundColor: checkColor(program)}" class="channel_time">
              {{timeConverter(program.program_start)}}</div>
            <div v-else class="channel_time">{{timeConverter(program.program_start)}}</div>
            <div v-if="program.program_description" v-b-popover.hover="program.program_description" title="Описание">
              {{program.program_name + ' '}} <i v-if="program.program_category" :class="checkLabel(program)"
                                                :style="{color:checkColor(program)}"></i></div>
            <div v-else> {{program.program_name + " "}} <i v-if="program.program_category" :class="checkLabel(program)"
                                                           :style="{color:checkColor(program)}"></i></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgramList',
  props: ['channels', 'dateList', 'dateForSample', 'pressed', 'timeList', 'timeForSample', 'category', 'now'],
  data () {
    return {
    }
  },
  methods: {
    changeStarred (channel) {
      this.$emit('changeStarred', channel)
    },
    changeReminder (channel, program) {
      this.$emit('changeReminder', channel, program)
    },
    getDayName: function (num) {
      switch (num) {
        case 1:
          return 'ПН'
        case 2:
          return 'ВТ'
        case 3:
          return 'СР'
        case 4:
          return 'ЧТ'
        case 5:
          return 'ПТ'
        case 6:
          return 'СБ'
        case 0:
          return 'ВС'
        default:
          return undefined
      }
    },
    timeConverter: function (parameters) {
      let date = new Date(parameters)
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10)
        ? ('0' + date.getMinutes()) : date.getMinutes())
      return time
    },
    changeDataInPL (key, date) {
      this.$emit('changeDataInPL', key, date)
    },
    changeTimeInPL (time) {
      this.$emit('changeTimeInPL', time)
    },
    getProgramClassName (program) {
      if (program.program_category === 'Спорт') {
        return 'sport'
      }
      return ''
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
.dateList {
  font-size: small;
  display: flex;
  align-items: flex-start;
  align-self: flex-start;
}
.date {
  padding: 5px;
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
  padding-right: 5px;
  padding-left: 5px;
  margin-bottom: 5px;
}
.card:hover .star {
  opacity: 1;
  transition: opacity 0.5s 1s;
}
.star {
  margin-top: 5px;
  font-size: 120%;
  color: silver;
  opacity: 0;
}
.star:hover {
  color: gold;
}
.star_active {
  opacity: 1;
  color: gold;
}
.channel_header {
  display: flex;
}
.channel_ico {
}
.channel_name {
  display: flex;
  font-size: medium;
  font-weight: bold;
  align-self: center;
  justify-content: center;
  flex-grow: 1;
}
.channel_time {
  margin: 0px 10px;
}
.channel_text {
  display: flex;
}
.channel_text:hover .bell {
  opacity: 1;
  transition: opacity 0.5s 0.5s;
}
.bell {
  font-size: 120%;
  color: silver;
  opacity: 0;
}
.bell:hover {
  color: gold;
}
.bell_active {
  opacity: 1;
  color: gold;
}
.channel_text:last-child {
  display: flex;
  margin-bottom: 10px;
}
.past {
  color: #888;
}
.current {
  font-weight: bold;
}
img {
  padding-right: 5px;
}
</style>
