<template>
  <div class="app">
    <b-navbar class="header" toggleable="lg" type="dark" variant="primary">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand :to="'/'">ТВ Программа</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item :class="{active: $route.path.match(/^\/fast/)}" :to="'/fast'">Сейчас в эфире</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/list/)}" :to="'/list'">Программа ТВ</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/programs/)}" :to="'/programs'">Тестовая</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/setting/)}" :to="'/settings'">Настройки</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-form onsubmit="return false">
            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Поиск по названию"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Искать</b-button>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>Профиль</em>
            </template>
            <b-dropdown-item :to="'/settings'">Настройки</b-dropdown-item>
            <b-dropdown-item :to="'/settings'">Войти</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
    <div class="menu">
      <div>
        <b-dropdown size="sm" id="ddown1" text="Все каналы" class="m-md-2" type="dark" variant="primary">
          <b-dropdown-item>Белорусские</b-dropdown-item>
          <b-dropdown-item>Спорт</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>Все каналы</b-dropdown-item>
          <b-dropdown-item>Любимые</b-dropdown-item>
          <b-dropdown-item>Скрытые</b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="check-type-program">
        <div class="form-check" v-for="(label, i) in category" :key="i">
          <label class="form-check-label">
              <input type="checkbox" class="form-check-input" v-model="category[i].checked">
            <i :class="label.icon" :style="{color: label.color}"></i> {{' ' + label.name + ' '}}
          </label>
        </div>
      </div>
    </div>
    <div class="sidebar"></div>
    <div class="content">
      <router-view :channels="sortedChannels" :fastView="currentProgram" :now="now" :dateList="dateList" :dateForSample="dateForSample"
                   :pressed="pressed" :timeList="timeList" :timeForSample="timeForSample" @changeDataInPL="changeDataInPL"
                   @changeTimeInPL="changeTimeInPL" :category="category" @changeStarred="changeStarred" @changeReminder="changeReminder"></router-view></div>
    <div class="footer">Программа телепередач, 2018</div>

  </div>
</template>

<script>
import _ from 'lodash'
/* import moment from 'moment' */
export default {
  name: 'App',
  data: function () {
    return {
      chPData: require('../src/tvp_02.json'),
      channels: [],
      channelsSample: [],
      channelsSortType: 'by-id-up',
      category: {
        film: {
          icon: 'fa fa-video',
          name: 'Фильм',
          color: '#007bff',
          checked: false
        },
        movie: {
          icon: 'fa fa-film',
          name: 'Сериал',
          color: '#E667AF',
          checked: false
        },
        informational: {
          icon: 'fa fa-align-justify',
          name: 'Новости',
          color: '#679FD2',
          checked: false
        },
        sport: {
          icon: 'fa fa-volleyball-ball',
          name: 'Спорт',
          color: '#7D71D8',
          checked: false
        },
        kids: {
          icon: 'fab fa-mailchimp',
          name: 'Детям',
          color: '#00fffc',
          checked: false
        },
        cognitive: {
          icon: 'fa fa-user-graduate',
          name: 'Познавательные',
          color: '#67E667',
          checked: false
        },
        entertaining: {
          icon: 'fa fa-theater-masks',
          name: 'Развлекательные',
          color: '#ffd3b0',
          checked: false
        },
        adult: {
          icon: 'fa fa-venus-mars',
          name: 'Взрослым',
          color: '#FF7373',
          checked: false
        }
      },
      counter: 0,
      dateForSample: {},
      dateList: [],
      now: 0,
      optionsChannelSort: [
        {text: 'По названию канала A->Z, А->Я', value: 'by-name-up'},
        {text: 'По названию канала Я->А, Z->A', value: 'by-name-down'},
        {text: 'По возрастанию ID канала ', value: 'by-id-up'},
        {text: 'По убыванию ID канала', value: 'by-id-down'}
      ],
      pressed: null,
      timeForSample: {start: 18000000, end: 102400000, name: 'сутки'},
      timeList: [
        {start: 18000000, end: 43200000, name: 'утро'},
        {start: 43200000, end: 64800000, name: 'день'},
        {start: 64800000, end: 86400000, name: 'вечер'},
        {start: 86400000, end: 102400000, name: 'ночь'},
        {start: 18000000, end: 102400000, name: 'сутки'}
      ]
    }
  },
  created: function () {
    this.channels = this.dataPreparation(this.chPData)
    let date = new Date()
    for (let channel of this.channels) {
      for (let program of channel.programs) {
        if (this.dateList.length === 0) {
          this.pushDayInWeek(program.program_start)
        } else if (this.getDateYYYYMMDD(this.dateList[this.dateList.length - 1].ms) <
          this.getDateYYYYMMDD(program.program_start - 18000000)) {
          this.pushDayInWeek(program.program_start)
        }
      }
    }
    setInterval(this.actualTime, 10000)
    this.now = date.valueOf()
    let yyyymmdd = this.getDateYYYYMMDD(this.now).toString()
    this.dateForSample.year = Number(yyyymmdd.slice(0, 4))
    this.dateForSample.month = Number((yyyymmdd.slice(4, 6)) < 10 ? ('0' + (yyyymmdd.slice(4, 6))) : (yyyymmdd.slice(4, 6)))
    this.dateForSample.day = Number((yyyymmdd.slice(6, 8)) < 10 ? ('0' + (yyyymmdd.slice(6, 8))) : (yyyymmdd.slice(6, 8)))
    date = new Date(this.dateForSample.year, this.dateForSample.month - 1, this.dateForSample.day)
    this.dateForSample.name = date.getDay()
    this.dateForSample.ms = date.valueOf()
    for (let i = 0; i < this.dateList.length; i++) {
      if (this.dateList[i].ms === this.dateForSample.ms) {
        this.pressed = i
      }
    }
  },
  methods: {
    actualTime () {
      let date = new Date()
      this.now = date.valueOf()
    },
    changeStarred (date) {
      for (let channel of this.channels) {
        if (channel.channel_id === date.channel_id) {
          channel.starred = !channel.starred
          break
        }
      }
      this.channels = this.channels.slice(0)
    },
    changeDataInPL (key, date) {
      this.pressed = key
      this.dateForSample = date
    },
    changeReminder (channelReminder, programReminder) {
      for (let channel of this.channels) {
        if (channel.channel_id === channelReminder.channel_id) {
          for (let program of channel.programs) {
            if (program.program_start === programReminder.program_start) {
              if (program.reminder) {
                program.reminder = !program.reminder
              } else {
                program.reminder = true
              }
              this.channels = this.channels.slice(0)
              return
            }
          }
        }
      }
    },
    changeTimeInPL (time) {
      this.timeForSample = time
    },
    dataPreparation (channels) {
      let result = []
      for (let channel of channels) {
        let data = {}
        data = channel
        data.starred = false
        data.hidden = false
        result.push(data)
      }
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
    currentProgram () {
      let result = []
      for (let channel of this.channels) {
        let data = {}
        let counter = 0
        for (let program of channel.programs) {
          if (program.program_start <= this.now && program.program_end > this.now) {
            data.channel_id = channel.channel_id
            data.channel_icon = channel.channel_icon
            data.channel_name = channel.channel_name
            data.starred = channel.starred
            data.hidden = channel.hidden
            data.program_start = program.program_start
            data.program_end = program.program_end
            data.program_name = program.program_name
            data.program_description = program.program_description
            data.program_category = program.program_category
            data.program_rating = program.program_rating
            counter++
            break
          }
        }
        if (counter > 0) {
          if (data.starred === true && data.hidden === false) {
            result.unshift(data)
          } else if (data.hidden === false) {
            result.push(data)
          }
        }
      }
      switch (this.channelsSortType) {
        case 'by-name-up':
          return _.orderBy(result, ['channel_name'], ['asc'])
        case 'by-name-down':
          return _.orderBy(result, ['channel_name'], ['desc'])
        case 'by-id-up':
          return _.orderBy(result, ['channel_id'], ['asc'])
        case 'by-id-down':
          return _.orderBy(result, ['channel_id'], ['desc'])
        default:
          return _.orderBy(result, ['channel_id'], ['asc'])
      }
    },
    sortedSampleChannels () {
      let date = new Date(this.dateForSample.year, this.dateForSample.month - 1, this.dateForSample.day)
      let result = []
      for (let channel of this.channels) {
        let data = {}
        let programs = []
        for (let program of channel.programs) {
          if ((program.program_start >= (date.valueOf() + this.timeForSample.start)) &&
            (program.program_start < date.valueOf() + this.timeForSample.end)) {
            programs.push(program)
          }
        }
        if (programs.length > 0) {
          data.channel_id = channel.channel_id
          data.channel_icon = channel.channel_icon
          data.channel_name = channel.channel_name
          data.starred = channel.starred
          data.hidden = channel.hidden
          data.programs = programs
          if (data.starred === true && data.hidden === false) {
            data.priority = 1
            result.unshift(data)
          } else if (data.hidden === false) {
            data.priority = 2
            result.push(data)
          } else {
            data.priority = 3
          }
        }
      }
      return result
    },
    sortedChannels () {
      let channels = this.sortedSampleChannels
      switch (this.channelsSortType) {
        case 'by-name-up':
          return _.orderBy(channels, ['priority', 'channel_name'], ['asc', 'asc'])
        case 'by-name-down':
          return _.orderBy(channels, ['priority', 'channel_name'], ['asc', 'desc'])
        case 'by-id-up':
          return _.orderBy(channels, ['priority', 'channel_id'], ['asc', 'asc'])
        case 'by-id-down':
          return _.orderBy(channels, ['priority', 'channel_id'], ['asc', 'desc'])
        default:
          return _.orderBy(channels, ['priority', 'channel_id'], ['asc', 'asc'])
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
}

.header2 {
  margin-top: 56px;
}
.nav {
  border-radius: 10px;
  background: lightgoldenrodyellow;
  align-items: center;
}
.footer {
  background: #007bff;
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
  display: flex;
  flex-wrap: wrap;
}
.content {
  background: white;
  border-radius: 10px;
}
.check-type-program {
  display: flex;
  flex-wrap: wrap;
}
.form-check {
  margin-left: 5px;
  margin-right: 5px;
}
.form-check-label {
  font-size: 70%;
}
a {
  font-size: 90%;
}
span {
  font-size: small;
}
img {
  margin: 10px;
  }
</style>
