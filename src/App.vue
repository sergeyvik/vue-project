<template>
  <div class="app">
    <div class="header">
      <nav class="nav">
        <!-- Brand/logo -->
        <a class="navbar-brand" href="#">
          <img src="../src/assets/pitivi.png" alt="logo" style="width:60px;">
        </a>
        <!-- Links -->
        <router-link class="nav-link" :to="'/fast'">Сейчас в эфире</router-link>
        <router-link class="nav-link" :to="'/list'">Программа ТВ</router-link>
        <router-link class="nav-link" :to="'/programs'">Программа ТВ</router-link>
        <router-link class="nav-link" :to="'/'">Пример изначальный</router-link>
      </nav>
    </div>
    <div class="menu">
      <div class="date" v-for="(date, key) in dateList" :key="key">
        {{date.day+'.'+date.month+' '+getDayName(date.name)}}
      </div>
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
      <router-view :channels="sortedChannels" :now="now"></router-view></div>
    <div class="footer">sdfgsgfgs</div>
  </div>
</template>

<script>
import _ from 'lodash'
/* import moment from 'moment' */
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
      now: 1541321000000
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
    /* this.now = date.valueOf() */
    let yyyymmdd = this.getDateYYYYMMDD(this.now).toString()
    this.dateForSample.year = Number(yyyymmdd.slice(0, 4))
    this.dateForSample.month = 1 + Number((yyyymmdd.slice(4, 6)) < 10 ? ('0' + (yyyymmdd.slice(4, 6))) : (yyyymmdd.slice(4, 6)))
    this.dateForSample.day = Number((yyyymmdd.slice(6, 8)) < 10 ? ('0' + (yyyymmdd.slice(6, 8))) : (yyyymmdd.slice(6, 8)))
    date = new Date(this.dateForSample.year, this.dateForSample.month - 1, this.dateForSample.day)
    this.dateForSample.name = date.getDay()
    this.dateForSample.ms = date.valueOf()
  },
  methods: {
    sortedSampleChannels: function (dateForSample, timeForSample) {
      let date = new Date(dateForSample.year, dateForSample.month - 1, dateForSample.day)
      date = new Date(2018, 10, 4)
      let result = []
      for (let channel of this.channels) {
        let data = {}
        let programs = []
        for (let program of channel.programs) {
          if (((date.valueOf() + timeForSample.start) <= program.program_start) &&
            (date.valueOf() + timeForSample.end) >= program.program_start) {
            programs.push(program)
          }
        }
        if (programs.length > 0) {
          data.channel_id = channel.channel_id
          data.channel_icon = channel.channel_icon
          data.channel_name = channel.channel_name
          data.programs = programs
          result.push(data)
        }
      }
      this.channelsSample = result
      return result
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
      temp.month = date.getMonth() + 1
      temp.day = date.getDate()
      temp.name = date.getDay()
      date = new Date(temp.year, temp.month - 1, temp.day)
      temp.ms = date.valueOf()
      if (temp.month < 10) {
        temp.month = '0' + temp.month
      }
      if (temp.day < 10) {
        temp.day = '0' + temp.day
      }
      this.dateList.push(temp)
    }
  },
  computed: {
    sortedChannels () {
      let channels = this.sortedSampleChannels(this.dateForSample, this.timeForSample)
      switch (this.channelsSortType) {
        case 'by-name-up':
          return _.orderBy(channels, ['channel_name'], ['asc'])
        case 'by-name-down':
          return _.orderBy(channels, ['channel_name'], ['desc'])
        case 'by-id-up':
          return _.orderBy(channels, ['channel_id'], ['asc'])
        case 'by-id-down':
          return _.orderBy(channels, ['channel_id'], ['desc'])
        default:
          return _.orderBy(channels, ['channel_id'], ['asc'])
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
  padding: 5px;
}
.header {
  margin: 5px 0px;
}
.nav {
  border-radius: 10px;
  background: lightgoldenrodyellow;
  align-items: center;
}
.date {
  font-size: small;
  displey: flex;
  flex-wrap: wrap;

}
.footer {
  background: lightgoldenrodyellow;
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
img {
  margin: 10px;
  }
</style>
