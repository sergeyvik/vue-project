<template>
  <div>
    <div>
      <b-form-select v-model="selected" :options="channelList"/>
    </div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in programsView"
           :key="channel.channel_label">
        <div class="channel_header">
          <div class="star" :class="{star_active: channel.starred}">
            <i class="fa-star" :class="[channel.starred?'fas':'far']" @click="changeStarred(channel)"></i>
          </div>
          <img v-if="channel.channel_icon" :src="channel.channel_icon" alt="Знак ТВ">
          <img v-else src="../assets/icon_tv.png" alt="Знак ТВ">
          <div class="channel_name">{{channel.channel_label}}</div>
          <div class="eye" :class="{eye_active: channel.hidden}">
            <i class="fa-eye-slash" :class="[channel.hidden?'fas':'far']" @click="changeHidden(channel)"></i>
          </div>
        </div>
        <div class="channel_text" :class="{past: now>program.program_end, current: now>program.program_start
           && now<program.program_end}" v-for="program in channel.programs" :key="program.program_start">
          <div v-if="now<program.program_start" class="bell" :class="{bell_active: program.reminder}">
            <i class="fa-bell" :class="[program.reminder?'fas':'far']" @click="changeReminder(channel, program)"></i>
          </div>
          <div v-else class="bell_slash">
            <i class="far fa-bell-slash"></i>
          </div>
          <div v-if="program.program_category" :style="{backgroundColor: checkColor(program)}" class="channel_time">
            {{timeConverter(program.program_start)}}</div>
          <div v-else class="channel_time">{{timeConverter(program.program_start)}}</div>
          <div class="program_text" v-if="program.program_description" v-b-popover.hover="program.program_description"
               title="Описание">
            {{program.program_name + ' '}} <i v-if="program.program_category" :class="checkLabel(program)"
                                              :style="{color:checkColor(program)}"></i></div>
          <div class="program_text" v-else> {{program.program_name + " "}} <i v-if="program.program_category"
                                                                              :class="checkLabel(program)"
                                                                              :style="{color:checkColor(program)}"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgramsView',
  props: ['now', 'dateList', 'channelList', 'channelsData', 'id', 'category'],
  data () {
    return {
      programView: [],
      selected: null
    };
  },
  watch: {
    selected () {
      this.$router.push({name: 'programs', params: {id: this.selected ? this.selected : null}});
    }
  },
  created: function () {
    let selected = parseInt(this.id, 10);
    if (!isNaN(selected) && selected !== undefined) {
      this.selected = selected;
    }
  },
  methods: {
    changeStarred (channel) {
      this.$emit('changeStarred', channel);
    },
    changeReminder (channel, program) {
      this.$emit('changeReminder', channel, program);
    },
    timeConverter (parameters) {
      let date = new Date(parameters);
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10)
        ? ('0' + date.getMinutes()) : date.getMinutes());
      return time;
    },
    changeDateInPL (key, date) {
      this.$emit('changeDateInPL', key, date);
    },
    changeHidden (channel) {
      this.$emit('changeHidden', channel);
    },
    changeTimeInPL (time) {
      this.$emit('changeTimeInPL', time);
    },
    getProgramClassName (program) {
      if (program.program_category === 'Спорт') {
        return 'sport';
      }
      return '';
    },
    checkColor (res) {
      for (let data in this.category) {
        if (this.category[data].name === res.program_category && this.category[data].checked === true) {
          return this.category[data].color;
        }
      }
      return '';
    },
    checkLabel (res) {
      for (let data in this.category) {
        if (this.category[data].name === res.program_category && this.category[data].checked === true) {
          return this.category[data].icon;
        }
      }
      return '';
    },
    getDayName: function (num) {
      switch (num) {
        case 0:
          return 'ПОНЕДЕЛЬНИК';
        case 1:
          return 'ВТОРНИК';
        case 2:
          return 'СРЕДА';
        case 3:
          return 'ЧЕТВЕРГ';
        case 4:
          return 'ПЯТНИЦА';
        case 5:
          return 'СУББОТА';
        case 6:
          return 'ВОСКРЕСЕНЬЕ';
        default:
          return undefined;
      }
    }
  },
  computed: {
    programsView () {
      let result = [];
      if (this.selected !== null) {
        for (let channel of this.channelsData) {
          if (channel.channel_id === this.selected) {
            for (let i = 0; i < this.dateList.length; i++) {
              let data = {};
              data.channel_id = channel.channel_id;
              data.channel_icon = channel.channel_icon;
              data.channel_name = channel.channel_name;
              data.starred = channel.starred;
              data.hidden = channel.hidden;
              data.programs = [];
              data.priority = channel.priority;
              data.channel_label = `${this.getDayName(i)} ${this.dateList[i].day}.${this.dateList[i].month}.${this.dateList[i].year}`;
              result.push(data);
            }
            for (let program of channel.programs) {
              if ((program.program_end > (this.dateList[0].ms + 18000000)) &&
                (program.program_start < this.dateList[0].ms + 102400000)) {
                result[0].programs.push(program);
              } else if ((program.program_end > (this.dateList[1].ms + 18000000)) &&
                (program.program_start < this.dateList[1].ms + 102400000)) {
                result[1].programs.push(program);
              } else if ((program.program_end > (this.dateList[2].ms + 18000000)) &&
                (program.program_start < this.dateList[2].ms + 102400000)) {
                result[2].programs.push(program);
              } else if ((program.program_end > (this.dateList[3].ms + 18000000)) &&
                (program.program_start < this.dateList[3].ms + 102400000)) {
                result[3].programs.push(program);
              } else if ((program.program_end > (this.dateList[4].ms + 18000000)) &&
                (program.program_start < this.dateList[4].ms + 102400000)) {
                result[4].programs.push(program);
              } else if ((program.program_end > (this.dateList[5].ms + 18000000)) &&
                (program.program_start < this.dateList[5].ms + 102400000)) {
                result[5].programs.push(program);
              } else if ((program.program_end > (this.dateList[6].ms + 18000000)) &&
                (program.program_start < this.dateList[6].ms + 102400000)) {
                result[6].programs.push(program);
              }
            }
            break;
          }
        }
      }
      return result;
    }
  }
};
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
    transition: opacity 0.5s 0.5s;
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
    font-size: small;
    font-weight: bold;
    align-self: center;
    justify-content: center;
    flex-grow: 1;
  }
  .channel_time {
    margin: 0px 5px;
    width: 33px;
    display: inline-block;
    vertical-align: top;
  }
  .channel_text {
    display: inline-block;
    width: 100%;
  }
  .program_text {
    display: inline-block;
    width: 75%;
    vertical-align: top;
  }
  .channel_text:hover .bell {
    opacity: 1;
    transition: opacity 0.5s 0.5s;
  }
  .channel_text:hover .bell_slash {
    opacity: 1;
    transition: opacity 0.5s 0.5s;
  }
  .bell, .bell_slash {
    font-size: 120%;
    color: silver;
    opacity: 0;
    display: inline-block;
    width: 20px;
    vertical-align: top;
  }
  .bell:hover {
    color: gold;
  }
  .bell_active {
    opacity: 1;
    color: gold;
  }
  .channel_text:last-child {
    margin-bottom: 10px;
  }
  .card:hover .eye {
    opacity: 1;
    transition: opacity 0.5s 0.5s;
  }
  .eye {
    margin-top: 5px;
    font-size: 120%;
    color: silver;
    opacity: 0;
  }
  .eye:hover {
    color: black;
  }
  .eye_active {
    opacity: 1;
    color: black;
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
  check-type-program {
    justify-content: flex-end;
    align-self: flex-end;
  }
</style>
