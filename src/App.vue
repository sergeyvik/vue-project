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
          <!--<b-nav-item :class="{active: $route.path.match(/^\/channel/)}" :to="'/channel'">Канал ТВ</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/setting/)}" :to="'/settings'">Настройки</b-nav-item>-->
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
        <b-dropdown size="sm" id="ddown1" :text="channelsGroups[channelsGroupsSelected].name" class="m-md-2" type="dark" variant="primary">
          <b-dropdown-item @click="channelsGroupsSelected=3">{{channelsGroups[3].name}}</b-dropdown-item>
          <b-dropdown-item @click="channelsGroupsSelected=4">{{channelsGroups[4].name}}</b-dropdown-item>
          <b-dropdown-item @click="channelsGroupsSelected=5">{{channelsGroups[5].name}}</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="channelsGroupsSelected=0">{{channelsGroups[0].name}}</b-dropdown-item>
          <b-dropdown-item @click="channelsGroupsSelected=1">{{channelsGroups[1].name}}</b-dropdown-item>
          <b-dropdown-item @click="channelsGroupsSelected=2">{{channelsGroups[2].name}}</b-dropdown-item>
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
      <router-view :now="now" :dateList="dateList" :pressed="pressed" :timeForSample="timeForSample"
                   @changeDateInPL="changeDateInPL" @changeTimeInPL="changeTimeInPL" :category="category"
                   @changeStarred="changeStarred" @changeReminder="changeReminder" @changeHidden="changeHidden"
                   :channelList="channelList" :channelSelected="channelSelected" :channelsGroupsSelected="channelsGroupsSelected"
                   :channelsData="channelsDataPreparation" :dateForSample="dateForSample" :channelsGroups="channelsGroups">
      </router-view></div>
    <div class="footer">Программа телепередач, 2018</div>

  </div>
</template>

<script>
import _ from 'lodash';
/* import moment from 'moment' */
// import axios from 'axios';
import api from './api';
export default {
  name: 'App',
  data: function () {
    return {
      channelsData: [],
      userProperties: {
        starredId: [],
        hiddenId: [],
        remindersId: {}
      },
      channelList: [],
      channelSelected: 1,
      channelsGroups: [
        {
          name: 'Все каналы'
        },
        {
          name: 'Избранные каналы',
          id: []
        },
        {
          name: 'Скрытые каналы',
          id: []
        },
        {
          name: 'Белорусские каналы',
          id: [1, 2, 3, 4, 5, 101, 103, 105, 300003, 300029, 300030, 300048, 300049, 300053, 300065, 300029, 300071,
            300072, 300075, 400007, 400020]
        },
        {
          name: 'Спортивные каналы',
          id: [205, 206]
        },
        {
          name: 'Новостные каналы',
          id: [208]
        }
      ],
      channelsGroupsSelected: 0,
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
      timeForSample: {start: 18000000, end: 102400000, name: 'сутки'}
    };
  },
  created: async function () {
    this.actualTime();
    let yyyymmdd = this.getDateYYYYMMDD(this.now).toString();
    this.getDateForSample(yyyymmdd);
    this.getDateList();
    console.dir(this.dateList);
    console.log(this.dateList);
    api.get('/channels', {
      params: {
        startWeek: this.dateList[0].ms + 18000000,
        endWeek: this.dateList[6].ms + 24 * 60 * 60 * 1000 + 18000000
      }
    })
      .then((response) => {
        // handle success
        this.channelsData = response.data;
        setInterval(this.actualTime, 10000);
        for (let i = 0; i < this.dateList.length; i++) {
          if (this.dateList[i].ms === this.dateForSample.ms) {
            this.pressed = i;
          }
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    actualTime () {
      let date = new Date();
      this.now = date.valueOf();
    },
    actualDayCheck () {
      let date = new Date();
      let result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return result.valueOf();
    },
    changeHidden (data) {
      for (let channel of this.channelsData) {
        if (channel.channel_id === data.channel_id) {
          // channel.hidden = !channel.hidden;
          if (this.channelsGroups[2].id.indexOf(channel.channel_id) > -1) {
            this.channelsGroups[2].id.splice(this.channelsGroups[2].id.indexOf(channel.channel_id), 1);
          } else {
            this.channelsGroups[2].id.push(channel.channel_id);
          }
          break;
        }
      }
      this.channelsData = this.channelsData.slice(0);
    },
    changeDateInPL (key, date) {
      this.pressed = key;
      this.dateForSample = date;
    },
    changeReminder (channelReminder, programReminder) {
      for (let channel of this.allChannels) {
        if (channel.channel_id === channelReminder.channel_id) {
          for (let program of channel.programs) {
            if (program.program_start === programReminder.program_start) {
              if (program.reminder) {
                program.reminder = !program.reminder;
              } else {
                program.reminder = true;
              }
              this.allChannels = this.allChannels.slice(0);
              return;
            }
          }
        }
      }
    },
    changeStarred (data) {
      for (let channel of this.channelsData) {
        if (channel.channel_id === data.channel_id) {
          // channel.starred = !channel.starred;
          console.dir(this.channelsGroups[1].id);
          if (this.channelsGroups[1].id.indexOf(channel.channel_id) > -1) {
            this.channelsGroups[1].id.splice(this.channelsGroups[1].id.indexOf(channel.channel_id), 1);
            console.log('True');
          } else {
            this.channelsGroups[1].id.push(channel.channel_id);
            console.log('False');
          }
          break;
        }
      }
      console.dir(this.channelsGroups[1].id);
      this.channelsData = this.channelsData.slice(0);
    },
    changeTimeInPL (time) {
      if (time.name === 'сейчас' && this.actualDayCheck() === this.dateForSample.ms) {
        time.start = this.now - this.dateForSample.ms;
      }
      this.timeForSample = time;
    },
    getDayName: function (num) {
      switch (num) {
        case 1:
          return 'ПН';
        case 2:
          return 'ВТ';
        case 3:
          return 'СР';
        case 4:
          return 'ЧТ';
        case 5:
          return 'ПТ';
        case 6:
          return 'СБ';
        case 0:
          return 'ВС';
        default:
          return undefined;
      }
    },
    getDateYYYYMMDD: function (ms) {
      let result;
      if (typeof (ms) === 'number') {
        let date = new Date(ms);
        let temp = {};
        temp.year = date.getFullYear().toString();
        temp.month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
        temp.day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate();
        result = Number(temp.year + temp.month + temp.day);
      }
      return result;
    },
    getDateForSample (yyyymmdd) {
      let date = new Date();
      this.dateForSample.year = Number(yyyymmdd.slice(0, 4));
      this.dateForSample.month = Number((yyyymmdd.slice(4, 6)) < 10 ? ('0' + (yyyymmdd.slice(4, 6))) : (yyyymmdd.slice(4, 6)));
      this.dateForSample.day = Number((yyyymmdd.slice(6, 8)) < 10 ? ('0' + (yyyymmdd.slice(6, 8))) : (yyyymmdd.slice(6, 8)));
      date = new Date(this.dateForSample.year, this.dateForSample.month - 1, this.dateForSample.day);
      this.dateForSample.name = date.getDay();
      this.dateForSample.ms = date.valueOf();
    },
    getDateList () {
      let ms = 0;
      if (this.dateForSample.name === 0) {
        ms = this.dateForSample.ms - 6 * 24 * 60 * 60 * 1000;
      } else {
        ms = this.dateForSample.ms - (this.dateForSample.name - 1) * 24 * 60 * 60 * 1000;
      }
      for (let i = 1; i <= 7; i++) {
        this.pushDayInWeek(ms);
        ms += 24 * 60 * 60 * 1000;
      }
    },
    pushDayInWeek: function (ms) {
      let date = new Date(ms);
      let temp = {};
      temp.year = date.getFullYear();
      temp.month = date.getMonth() + 1;
      temp.day = date.getDate();
      temp.name = date.getDay();
      date = new Date(temp.year, temp.month - 1, temp.day);
      temp.ms = date.valueOf();
      if (temp.month < 10) {
        temp.month = '0' + temp.month;
      }
      if (temp.day < 10) {
        temp.day = '0' + temp.day;
      }
      this.dateList.push(temp);
    }
  },
  computed: {
    channelsDataPreparation () {
      let result = [];
      for (let channel of this.channelsData) {
        if (this.channelsGroups[1].id.indexOf(channel.channel_id) > -1) {
          channel.starred = true;
        } else {
          channel.starred = false;
        }
        if (this.channelsGroups[2].id.indexOf(channel.channel_id) > -1) {
          channel.hidden = true;
        } else {
          channel.hidden = false;
        }
        if (channel.starred === true && channel.hidden === false) {
          channel.priority = 1;
        } else if (channel.hidden === false) {
          channel.priority = 2;
        } else {
          channel.priority = 3;
        }
        result.push(channel);
      }
      return _.orderBy(result, ['priority', 'channel_name'], ['asc', 'asc']);
    }
  }
};
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
    background: #bababa;
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
