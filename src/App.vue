<template>
  <div class="app">
    <div class="header"> {{channels[0].channel_name}} </div>
    <div class="menu">
      <router-link class="btn btn-primary" tag="button" :to="'/fast'">Сейчас в эфире</router-link>
      <router-link class="btn btn-primary" tag="button" :to="'/list'">Программа ТВ</router-link>
      <router-link class="btn btn-primary" tag="button" :to="'/programs'">Программа ТВ</router-link>
      <router-link class="btn btn-primary" tag="button" :to="'/'">Пример изначальный</router-link>
    </div>
    <div class="sidebar"></div>
    <div class="content">
      <select v-model="channelsSortType">
        <option v-for="option in optionsChannelSort" v-bind:value="option.value" :key="option.text">
          {{ option.text }}
        </option>
      </select> Режим сортировки: {{channelsSortType}}
      <router-view :channels="sortedChannels"></router-view></div>
    <div class="footer">sdfgsgfgs Неделя: {{dateList.length}} Counter: {{counter}}</div>
      <div v-for="(program, key) in dateList"  :key="key">
        {{program.month}}.{{program.day}}
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'App',
  data: function () {
    return {
      channels: require('../src/tvp_00.json'),
      dateList: [],
      channelsSample: [],
      channelsSortType: 'by-id-down',
      optionsChannelSort: [
        {text: 'По названию канала A->Z, А->Я', value: 'by-name-up'},
        {text: 'По названию канала Я->А, Z->A', value: 'by-name-down'},
        {text: 'По возрастанию ID канала ', value: 'by-id-up'},
        {text: 'По убыванию ID канала', value: 'by-id-down'}
      ],
      counter: 0,
      dateForSample: {},
      timeForSample: {start: 0, end: 84400000},
      now: null
    }
  },
  created: function () {
    let date = new Date()
    for (let channel of this.channels) {
      for (let program of channel.programs) {
        if (this.dateList.length === 0) {
          this.pushDayInWeek(program.program_start)
        } else if (this.getDateYYYYMMDD(this.dateList[this.dateList.length - 1].ms) < this.getDateYYYYMMDD(program.program_start)) {
          this.pushDayInWeek(program.program_start)
        }
      }
    }
    this.now = date.valueOf()
    let yyyymmdd = this.getDateYYYYMMDD(this.now).toString()
    this.dateForSample.year = Number(yyyymmdd.slice(0, 4))
    this.dateForSample.month = 1 + Number((yyyymmdd.slice(4, 6)) < 10 ? ('0' + (yyyymmdd.slice(4, 6))) : (yyyymmdd.slice(4, 6)))
    this.dateForSample.day = Number((yyyymmdd.slice(6, 8)) < 10 ? ('0' + (yyyymmdd.slice(6, 8))) : (yyyymmdd.slice(6, 8)))
    date = new Date(this.dateForSample.year, this.dateForSample.month - 1, this.dateForSample.day)
    this.dateForSample.ms = date.valueOf()
  },
  methods: {
    getWeek: function () {
      let now = moment()
      moment.locale('ru')
      return now
    },
    sortedSampleChannels (dateForSample, timeForSample) {
      let date = new Date(dateForSample.year, dateForSample.month - 1, dateForSample.day)
      let result = []
      for (let channel of this.channels) {
        let data = {}
        for (let program of channel.programs) {
          if (((date.valueOf() + timeForSample.start) <= program.program_start) &&
            (date.valueOf() + timeForSample.end) >= program.program_start) {
            data.programs.push(program)
          }
        }
        if (data.programs.length > 0) {
          data.channel_id = channel.channel_id
          data.channel_icon = channel.channel_icon
          data.channel_name = channel.channel_name
          result.push(data)
        }
      }
      this.channelsSample = result
      return result
    },
    getDateYYYYMMDD: function (ms) {
      let result
      if (typeof (ms) === 'number') {
        let date = new Date(ms)
        let temp = {}
        temp.year = date.getFullYear().toString()
        temp.month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
        temp.day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate()
        result = Number(temp.year + temp.month + temp.day)
      }
      return result
    },
    pushDayInWeek: function (ms) {
      let date = new Date(ms)
      let temp = {}
      temp.year = date.getFullYear()
      temp.month = Number(((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1))
      temp.day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate()
      date = new Date(temp.year, temp.month - 1, temp.day)
      temp.ms = date.valueOf()
      this.dateList.push(temp)
    }
  },
  computed: {
    sortedChannels () {
      switch (this.channelsSortType) {
        case 'by-name-up':
          return _.orderBy(this.channels, ['channel_name'], ['asc'])
        case 'by-name-down':
          return _.orderBy(this.channels, ['channel_name'], ['desc'])
        case 'by-id-up':
          return _.orderBy(this.channels, ['channel_id'], ['asc'])
        case 'by-id-down':
          return _.orderBy(this.channels, ['channel_id'], ['desc'])
        default:
          return _.orderBy(this.channels, ['channel_id'], ['asc'])
      }
    }
  }
}
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: hotpink;
  padding: 5px;
}
.header {
  background: chocolate;
  padding: 20px;
  text-align: center;
  margin: 5px 0px;
  border-radius: 10px;
}
.footer {
  background: brown;
  padding: 20px;
  text-align: center;
  margin: 5px 0px;
  border-radius: 10px;
}
.menu {
  background: lightgoldenrodyellow;
  padding: 5px 20px;
  margin: 5px 0px;
  border-radius: 10px;
}
.content {
  background: white;
  border-radius: 10px;
}
</style>
