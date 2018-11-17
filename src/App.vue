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
    <div class="content"> <router-view :channels="sortedChannels"></router-view></div>
    <div class="footer">sdfgsgfgs</div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data: function () {
    return {
      channels: require('../src/tvp_00.json'),
      info: [],
      channelsSortType: 'byidup'
    }
  },
  methods: {
    sortChannelsByIdUp: function (first, second) { // По возрастанию channel_ID
      if (first.channel_id > second.channel_id) { return 1 } else if (first.channel_id < second.channel_id) { return -1 } else { return 0 }
    },
    sortChennelsByIdDown: function (first, second) { // По убыванию channel_ID
      if (first.channel_id < second.channel_id) { return 1 } else if (first.channel_id > second.channel_id) { return -1 } else { return 0 }
    },
    sortChannelsByNameUp: function (first, second) { // По возрастанию channel_name
      if (first.channel_name > second.channel_name) { return 1 } else if (first.channel_name < second.channel_name) { return -1 } else { return 0 }
    },
    sortChannelsByNameDown: function (first, second) { // По убыванию channel_name
      if (first.channel_name < second.channel_name) { return 1 } else if (first.channel_name > second.channel_name) { return -1 } else { return 0 }
    }
  },
  computed: {
    sortedChannels () {
      let data = this.channels
      switch (this.channelsSortType) {
        case 'bynameup':
          return data.sort(this.sortChannelsByIdUp)
        case 'bynamedown':
          return data.sort(this.sortChennelsByIdDown)
        case 'byidup':
          return data.sort(this.sortChannelsByNameUp)
        case 'byidown':
          return data.sort(this.sortChannelsByNameDown)
        default:
          return data.sort(this.sortChannelsByIdUp)
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
