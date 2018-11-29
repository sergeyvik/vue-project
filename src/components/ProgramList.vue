<template>
  <div>
    <div class="dateList">
      <div class="date" v-for="(date, key) in dateList" :key="key">
        <b-button :pressed="key === pressed" @click="changeDataInPL(key, dateList[key])" variant="primary" size="sm">
          {{date.day+'.'+date.month+' '+getDayName(date.name)}} <b-badge v-if="key===pressed" variant="light">
          {{'за '+timeForSample.name}}</b-badge>
        </b-button>
        <b-dropdown v-if="key===pressed" :pressed="true" right size="sm" variant="primary">
          <b-dropdown-item @click="changeTimeInPL(timeList[0])"><span>ночь  00.00-06.00</span></b-dropdown-item>
          <b-dropdown-item @click="changeTimeInPL(timeList[1])"><span>утро  06.00-12.00</span></b-dropdown-item>
          <b-dropdown-item @click="changeTimeInPL(timeList[2])"><span>день  12.00-18.00</span></b-dropdown-item>
          <b-dropdown-item @click="changeTimeInPL(timeList[3])"><span>вечер 18.00-24.00</span></b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="changeTimeInPL(timeList[4])"><span>сутки 00.00-24.00</span></b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in channels" :key="channel.channel_id">
          <div class="channel_header">
            <div class="channel_ico"> <img :src="channel.channel_icon" alt="Значок телеканала отсутствует"></div>
            <div class="channel_name">{{channel.channel_name}}</div>
          </div>
          <div class="channel_text" v-for="program in channel.programs" :key="program.program_start">
            <div :class="[getProgramClassName(program)]" :style="{backgroundColor: '#ff0000'}" class="channel_time">{{timeConverter(program.program_start)}}</div>
            <div v-if="program.program_description" v-b-popover.hover="program.program_description" title="Описание"> {{program.program_name}}</div>
            <div v-else> {{program.program_name}}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgramList',
  props: ['channels', 'dateList', 'dateForSample', 'pressed', 'timeList', 'timeForSample'],
  data () {
    return {
    }
  },
  methods: {
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
.sport {
  background: aquamarine;
}
img {
  padding-right: 5px;
}
</style>
