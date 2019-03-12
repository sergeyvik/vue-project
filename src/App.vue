<template>
  <div class="app">
    <b-navbar class="header" toggleable="lg" type="dark" variant="primary">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand :to="'/'">ТВ Программа</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item :class="{active: $route.path.match(/^\/fast/)}" :to="'/fast'">Сейчас в эфире</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/list/)}" :to="'/list'">Программы ТВ</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/programs/)}" :to="'/programs'">Канал ТВ</b-nav-item>
          <!--<b-nav-item :class="{active: $route.path.match(/^\/channel/)}" :to="'/channel'">Канал ТВ</b-nav-item>
          <b-nav-item :class="{active: $route.path.match(/^\/setting/)}" :to="'/settings'">Настройки</b-nav-item>-->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-form onsubmit="return false">
            <b-form-input size="sm" class="mr-sm-2" v-model="textSearch" type="text" placeholder="Поиск по названию"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit" @click="searchResult">Искать</b-button>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>Профиль</em>
            </template>
            <b-dropdown-item :to="'/settings'">Настройки</b-dropdown-item>
            <b-dropdown-item v-if="userId===0" v-b-modal.modalAuth @click="showAut=true">Войти</b-dropdown-item>
            <b-dropdown-item v-else @click="exitButton">Выйти</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <b-modal id="modalAuth" size="sm" title="Авторизация" v-model="showAut" header-bg-variant="primary" headerTextVariant="light">
      <b-container fluid>
        <form @submit.stop.prevent="handleSubmit">
          <b-form-input type="text" placeholder="Введите ваш логин" v-model="loginE" />
          <b-form-input type="password" placeholder="Введите ваш пароль" v-model="passwordE" />
          <p class="login-check">{{checkEnter}}</p>
        </form>
      </b-container>

      <div slot="modal-footer" class="w-100">
        <b-button size="sm" class="float-left" variant="primary" @click="enterButton">Вход</b-button>
        <b-button size="sm" class="float-right" variant="primary" @click="showReg=true">Регистрация</b-button>
      </div>
    </b-modal>

    <b-modal id="modalReg" size="sm" title="Регистрация" v-model="showReg" header-bg-variant="primary" headerTextVariant="light">
      <b-container fluid>
        <form @submit.stop.prevent="handleSubmit">
          <b-form-input type="text" placeholder="Укажите ваше имя" v-model="name" />
          <b-form-input type="text" placeholder="Укажите ваш логин" v-model="login" />
          <p class="login-check">{{checkAnswer}}</p>
          <b-form-input type="password" placeholder="Укажите ваш пароль" v-model="password" />
          <b-form-input type="text" placeholder="Укажите ваш e-mail" v-model="email" />
        </form>
      </b-container>

      <div slot="modal-footer" class="w-100">
        <b-button size="sm" class="float-left" variant="primary" @click="cancelButton">Отмена</b-button>
        <b-button size="sm" class="float-right" variant="primary" @click="registerButton" :disabled="regButton">Регистрация</b-button>
      </div>
    </b-modal>

    <b-modal id="modalReminder" size="sm" title="Напоминание" v-model="showRem" header-bg-variant="primary" headerTextVariant="light">
      <b-container fluid>
        <form @submit.stop.prevent="handleSubmit">
          <p v-if="remindersData.length>0" class="reminder">{{dataConverter(remindersData[0].program_start)}}</p>
          <p v-if="remindersData.length>0" class="reminder">Канал: {{remindersData[0].channel_name?remindersData[0].channel_name:null}}</p>
          <p v-if="remindersData.length>0" class="reminder">{{remindersData[0].program_name?remindersData[0].program_name:null}}</p>
          <p v-if="remindersData.length>0" class="reminder">Время начала: {{remindersData[0].program_start?timeConverter(remindersData[0].program_start):null}}</p>
          <p v-if="remindersData.length>0" class="reminder">Время окончания: {{remindersData[0].program_end?timeConverter(remindersData[0].program_end):null}}</p>
        </form>
      </b-container>

      <div slot="modal-footer" class="w-100">
        <b-button size="sm" class="float-left" variant="primary" @click="removeReminderWindow">Убрать</b-button>
      </div>
    </b-modal>

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
                   :channelList="channelList" :channelsGroupsSelected="channelsGroupsSelected" @selectChannel="selectChannel"
                   :channelsData="channelsDataPreparation" :dateForSample="dateForSample" :channelsGroups="channelsGroups">
      </router-view></div>
    <div class="footer">Программа телепередач, 2018</div>

  </div>
</template>

<script>
import _ from 'lodash';
import sha1 from 'sha1';
/* import moment from 'moment' */
import axios from 'axios';
import api from './api';
export default {
  name: 'App',
  data: function () {
    return {
      name: '',
      login: '',
      loginE: '',
      password: '',
      passwordE: '',
      email: '',
      showAut: false,
      showReg: false,
      showRem: false,
      checkAnswer: null,
      checkEnter: null,
      textSearch: null,
      textSearchDebounced: null,
      regButton: false,
      channelsData: [],
      remindersId: [],
      remindersData: [],
      channelList: [],
      channelSelected: null,
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
      timeForSample: {start: 18000000, end: 102400000, name: 'сутки'},
      userId: 0
    };
  },
  created: async function () {
    this.loadToken();
    this.start();
    this.getUserData();
    this.debouncedCheckLogin = _.debounce(this.checkLogin, 500);
    this.debouncedSearch = _.debounce(() => {
      this.textSearchDebounced = this.textSearch;
    }, 500);
  },
  methods: {
    removeReminderWindow () {
      this.remindersData.shift();
      if (this.remindersData.length === 0) {
        this.showRem = false;
      }
    },
    timeConverter (parameters) {
      let date = new Date(parameters);
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10)
        ? ('0' + date.getMinutes()) : date.getMinutes());
      return time;
    },
    dataConverter (parameters) {
      let result = '';
      let date = new Date(parameters);
      result = ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate()) + '.' + ((date.getMonth() < 10)
        ? ('0' + date.getMonth()) : date.getMonth()) + '.' + date.getFullYear();
      return result;
    },
    start () {
      this.actualTime();
      let yyyymmdd = this.getDateYYYYMMDD(this.now).toString();
      this.getDateForSample(yyyymmdd);
      this.getDateList();
      api.get('/channelsData', {
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
          this.channelListPreparation();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    exitButton () {
      this.deleteToken();
      this.userId = 0;
      this.remindersId = [];
      this.remindersData = [];
      this.clearReminders();
      this.channelSelected = null;
      // this.dateList = [];
      this.channelsGroups[1].id = [];
      this.channelsGroups[2].id = [];
    },
    checkLogin () {
      api.get('/checkLogin', {
        params: {
          login: this.login
        }
      })
        .then((response) => {
          // handle success
          if (response.data === 0) {
            this.checkAnswer = null;
            this.regButton = false;
          } else {
            this.checkAnswer = 'Логин занят, укажите другой!';
            this.regButton = true;
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    selectChannel (id) {
      this.channelSelected = id;
    },
    cancelButton () {
      this.showReg = false;
      this.name = '';
      this.login = '';
      this.password = '';
      this.email = '';
    },
    async enterButton () {
      const response = await api.post('/login', {
        params: {
          login: this.loginE,
          password: sha1(this.passwordE)
        }
      });
      if (response.data && response.data.token) {
        this.saveToken(response.data.token);
        this.showAut = false;
        this.loginE = null;
        this.passwordE = null;
        this.checkEnter = null;
        await this.getUserData();
      } else {
        this.checkEnter = 'Опечатка в логине или пароле!';
      }
    },
    async getUserData () {
      const response = await api.get('/userData');
      if (response && response.data) {
        this.userId = response.data.id;
        let object = response.data.userData1;
        for (let elem of object) {
          for (let num in elem) {
            if (elem[num].starred === 1) {
              this.channelsGroups[1].id.push(Number(num));
            }
            if (elem[num].hidden === 1) {
              this.channelsGroups[2].id.push(Number(num));
            }
          }
        }
        this.remindersId = [];
        this.remindersId.push(response.data.userData2);
      }
    },
    saveToken (token) {
      localStorage.setItem('jwt', token);
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
    },
    loadToken () {
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      };
    },
    deleteToken () {
      localStorage.removeItem('jwt');
      axios.defaults.headers.common = {
        'Authorization': null
      };
    },
    registerButton () {
      if (this.login.length > 0 && this.password.length > 0) {
        this.showReg = false;
        api.post('/userRecord', {
          params: {
            name: this.name,
            login: this.login,
            password: sha1(this.password),
            email: this.email
          }
        })
          .then((response) => {
            // handle success
            this.name = '';
            this.login = '';
            this.password = '';
            this.email = '';
            this.showAut = true;
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
      }
    },
    handleSubmit () {
      console.log('handleSubmit');
    },
    actualTime () {
      let date = new Date();
      this.now = date.valueOf();
      if (this.remindersId.length > 0) {
        for (let reminder in this.remindersId[0]) {
          if (this.remindersId[0][reminder].reminder_time === this.getDateForCompare(this.now)) {
            console.log('Уведомление сработало!!!', reminder);
            console.log('Что удаляем!!!', this.remindersId[0][reminder]);
            api.get('/reminder', {
              params: {
                program_id: reminder
              }
            })
              .then((response) => {
                // handle success
                console.log(response.data);
                console.log('Нулевой элемент', response.data[0]);
                let remind = {};
                remind.program_id = response.data[0].program_id;
                remind.channel_name = response.data[0].channel_name;
                remind.program_name = response.data[0].program_name;
                remind.program_start = response.data[0].program_start;
                remind.program_end = response.data[0].program_end;
                this.remindersData.unshift(remind);
                if (this.userId > 0) {
                  api.get('/reminderOFF', {
                    params: {
                      userId: this.userId,
                      reminder_id: reminder
                    }
                  })
                    .then((response) => {
                      // handle success
                      delete this.remindersId[0][reminder];
                      this.remindersId = this.remindersId.slice(0);
                    })
                    .catch(function (error) {
                      // handle error
                      console.log(error);
                    });
                } else {
                  delete this.remindersId[0][reminder];
                  this.remindersId = this.remindersId.slice(0);
                }
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          }
        }
      }
    },
    actualDayCheck () {
      let date = new Date();
      let result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return result.valueOf();
    },
    changeHidden (data) {
      for (let channel of this.channelsData) {
        if (channel.channel_id === data.channel_id) {
          if (this.channelsGroups[2].id.indexOf(channel.channel_id) > -1) {
            this.channelsGroups[2].id.splice(this.channelsGroups[2].id.indexOf(channel.channel_id), 1);
            if (this.userId > 0) {
              api.get('/hiddenOFF', {
                params: {
                  id: channel.channel_id,
                  userId: this.userId
                }
              })
                .then((response) => {
                  // handle success
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                });
            }
          } else {
            this.channelsGroups[2].id.push(channel.channel_id);
            if (this.userId > 0) {
              api.get('/hiddenON', {
                params: {
                  id: channel.channel_id,
                  userId: this.userId
                }
              })
                .then((response) => {
                  // handle success
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                });
            }
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
      for (let channel of this.channelsData) {
        if (channel.channel_id === channelReminder.channel_id) {
          for (let program of channel.programs) {
            if (program.program_start === programReminder.program_start) {
              if (this.remindersId.length > 0 && typeof this.remindersId[0][program.program_id] === 'object') {
                if (this.userId > 0) {
                  api.get('/reminderOFF', {
                    params: {
                      userId: this.userId,
                      reminder_id: this.remindersId[0][program.program_id].reminder_id
                    }
                  })
                    .then((response) => {
                      // handle success
                      delete this.remindersId[0][program.program_id];
                      this.remindersId = this.remindersId.slice(0);
                    })
                    .catch(function (error) {
                      // handle error
                      console.log(error);
                    });
                } else {
                  delete this.remindersId[0][program.program_id];
                  this.remindersId = this.remindersId.slice(0);
                }
              } else {
                if (this.userId > 0) {
                  api.get('/reminderON', {
                    params: {
                      userId: this.userId,
                      program_id: program.program_id,
                      text: program.program_name,
                      time: program.program_start,
                      type: 1
                    }
                  })
                    .then((response) => {
                      // handle success
                      this.remindersId[0][program.program_id] = {};
                      this.remindersId[0][program.program_id].reminder_id = response.data;
                      this.remindersId[0][program.program_id].reminder_text = program.program_name;
                      this.remindersId[0][program.program_id].reminder_time = program.program_start;
                      this.remindersId[0][program.program_id].reminder_type = 1;
                      this.remindersId = this.remindersId.slice(0);
                    })
                    .catch(function (error) {
                      // handle error
                      console.log(error);
                    });
                } else {
                  if (this.remindersId.length === 0) {
                    this.remindersId[0] = {};
                  }
                  this.remindersId[0][program.program_id] = {};
                  this.remindersId[0][program.program_id].reminder_id = null;
                  this.remindersId[0][program.program_id].reminder_text = program.program_name;
                  this.remindersId[0][program.program_id].reminder_time = program.program_start;
                  this.remindersId[0][program.program_id].reminder_type = 1;
                  this.remindersId = this.remindersId.slice(0);
                }
              }
              return;
            }
          }
        }
      }
    },
    changeStarred (data) {
      for (let channel of this.channelsData) {
        if (channel.channel_id === data.channel_id) {
          if (this.channelsGroups[1].id.indexOf(channel.channel_id) > -1) {
            this.channelsGroups[1].id.splice(this.channelsGroups[1].id.indexOf(channel.channel_id), 1);
            if (this.userId > 0) {
              api.get('/starredOFF', {
                params: {
                  id: channel.channel_id,
                  userId: this.userId
                }
              })
                .then((response) => {
                  // handle success
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                });
            }
          } else {
            this.channelsGroups[1].id.push(channel.channel_id);
            if (this.userId > 0) {
              api.get('/starredON', {
                params: {
                  id: channel.channel_id,
                  userId: this.userId
                }
              })
                .then((response) => {
                  // handle success
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                });
            }
          }
          break;
        }
      }
      this.channelsData = this.channelsData.slice(0);
    },
    changeTimeInPL (time) {
      if (time.name === 'сейчас' && this.actualDayCheck() === this.dateForSample.ms) {
        time.start = this.now - this.dateForSample.ms;
      }
      this.timeForSample = time;
    },
    channelListPreparation () {
      let result = [];
      for (let channel of this.channelsData) {
        let object = {};
        object.value = channel.channel_id;
        object.text = channel.channel_name;
        result.push(object);
      }
      result = _.orderBy(result, ['text'], ['asc']);
      result.unshift({text: 'Выберите канал для просмотра передач', value: null});
      this.channelList = result;
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
    getDateForCompare (ms) {
      let result;
      if (typeof (ms) === 'number') {
        let date = new Date(ms);
        let temp = {};
        temp.year = date.getFullYear();
        temp.month = date.getMonth();
        temp.day = date.getDate();
        temp.hour = date.getHours();
        temp.min = date.getMinutes();
        result = new Date(temp.year, temp.month, temp.day, temp.hour, temp.min);
      }
      return result.valueOf();
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
    },
    searchResult () {
      let result = [];
      if (this.textSearchDebounced) {
        let str1 = this.textSearchDebounced.toLowerCase();
        let str2 = this.textSearchDebounced[0].toUpperCase() + str1.substring(1, str1.length);
        let str3 = this.textSearchDebounced.toUpperCase();
        for (let channel of this.channelsData) {
          let data = {};
          let programs = [];
          for (let program of channel.programs) {
            if (program.program_name.indexOf(this.textSearchDebounced) > -1 || program.program_name.indexOf(str1) > -1 ||
              program.program_name.indexOf(str2) > -1 || program.program_name.indexOf(str3) > -1) {
              programs.push(program);
            }
          }
          if (programs.length > 0 || channel.channel_name.indexOf(this.textSearchDebounced) > -1 ||
            channel.channel_name.indexOf(str1) > -1 || channel.channel_name.indexOf(str2) > -1 ||
            channel.channel_name.indexOf(str3) > -1) {
            data.channel_id = channel.channel_id;
            data.channel_icon = channel.channel_icon;
            data.channel_name = channel.channel_name;
            data.programs = programs;
            result.push(data);
          }
        }
        return result;
      } else {
        return this.channelsData;
      }
    },
    clearReminders () {
      for (let channel of this.channelsData) {
        for (let program of channel.programs) {
          program.reminder = false;
        }
      }
    }
  },
  computed: {
    channelsDataPreparation () {
      let result = [];
      let channels = this.searchResult();
      for (let channel of channels) {
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
        if (this.remindersId[0]) {
          for (let program of channel.programs) {
            if (program.program_id in this.remindersId[0]) {
              program.reminder = true;
            } else {
              program.reminder = false;
            }
          }
        }
        result.push(channel);
      }
      return _.orderBy(result, ['priority', 'channel_name'], ['asc', 'asc']);
    }
  },
  watch: {
    login () {
      this.debouncedCheckLogin();
    },
    remindersData () {
      if (this.remindersData.length > 0) {
        this.showRem = true;
      }
    },
    textSearch () {
      this.debouncedSearch();
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
  .login-check {
    font-size: small;
    color: red;
    margin: 0px;
  }
  .reminder {
    font-size: small;
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
