<template>
  <div>
    <div class="list">
      <div class="card col-12 col-sm-6 col-md-4 b-col-lg-3 col-xl-3" v-for="channel in fastView"
           :key="channel.channel_id">
        <div class="card_header">
          <div class="star" :class="{star_active: channel.starred}">
            <i class="fa-star" :class="[channel.starred?'fas':'far']" @click="changeStarred(channel)"></i>
          </div>
          <div class="channel_ico">
            <img v-if="channel.channel_icon" :src="channel.channel_icon" alt="Знак ТВ">
            <img v-else src="../assets/icon_tv.png" alt="Знак ТВ">
          </div>
          <div class="channel_header" @click="toChannel(channel.channel_id)">
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
          <div class="eye" :class="{eye_active: channel.hidden}">
            <i class="fa-eye-slash" :class="[channel.hidden?'fas':'far']" @click="changeHidden(channel)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FastView',
  props: ['now', 'category', 'channelsData', 'channelsGroupsSelected'],
  data () {
    return {
      currentProgramList: [],
      temp: []
    };
  },
  methods: {
    timeConverter (parameters) {
      let date = new Date(parameters);
      let time = ((date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()) + '.' + ((date.getMinutes() < 10)
        ? ('0' + date.getMinutes()) : date.getMinutes());
      return time;
    },
    changeStarred (channel) {
      this.$emit('changeStarred', channel);
    },
    changeHidden (channel) {
      this.$emit('changeHidden', channel);
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
    toChannel (id) {
      this.$emit('selectChannel', id);
      this.$router.push({name: 'programs', params: {id}});
    }
  },
  computed: {
    fastView () {
      let result = [];
      for (let channel of this.channelsData) {
        let data = {};
        for (let program of channel.programs) {
          if (program.program_start <= this.now && program.program_end > this.now) {
            data.channel_id = channel.channel_id;
            data.channel_icon = channel.channel_icon;
            data.channel_name = channel.channel_name;
            data.starred = channel.starred;
            data.hidden = channel.hidden;
            data.program_start = program.program_start;
            data.program_end = program.program_end;
            data.program_name = program.program_name;
            data.program_description = program.program_description;
            data.program_category = program.program_category;
            data.program_rating = program.program_rating;
            break;
          }
        }
        switch (this.channelsGroupsSelected) {
          case 0:
            if (data.hidden === false) {
              result.push(data);
            }
            break;
          case 1:
            if (data.starred === true && data.hidden === false) {
              result.push(data);
            }
            break;
          case 2:
            if (data.hidden === true) {
              result.push(data);
            }
            break;
          default:
            return result;
        }
      }
      return result;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    font-family: Arial, Helvetica, sans-serif;
    font-size: small;
  }
  img {
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
