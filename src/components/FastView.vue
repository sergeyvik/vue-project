<template>
  <div>
    <div class="d-flex flex-wrap">
      <div class="card col-12 col-sm-6 col-md-3 b-col-lg-4 col-xl-2" v-for="channel in channels" :key="channel.channel_id">
        <div>
            <img :src="channel.channel_icon" alt="Значок телеканала отсутствует">
        </div>
            <p>{{channel.channel_name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FastView',
  data () {
    return {
      channels: require('../tvp_cha00s.json'),
      programs: require('../tvp_pro00s.json')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .d-flex {
    background: greenyellow;
  }
  .card {
    background: khaki;
    border: 1px dotted aqua;
  }

</style>
