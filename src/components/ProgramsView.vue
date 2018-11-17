<template>
  <div>
    <div class="d-flex flex-wrap">
      <div class="card col-12 col-sm-6 col-md-3 b-col-lg-4 col-xl-2" v-for="channel in channels" :key="channel.channel_id">
        <div>
            <img :src="channel.channel_icon" alt="Значок телеканала отсутствует">
        </div>
        <div class="list" v-for="program in ProgramList(channel.channel_id)" :key="program.program_name">
          <p>{{program.program_name}}</p> <p>{{program.program_category}}</p> <p>{{program.program_description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgramsView',
  props: ['channels'],
  data () {
    return {
    }
  },
  methods: {
    ProgramList: function (parameters) {
      let channelId = parameters.channelId
      const list = []
      for (let prog in this.programs) {
        console.log(prog.channel_id)
        console.log(prog.channelId)
        if (prog.channel_id === channelId) {
          list.push(prog)
        }
      }
      return this.list
    }
  },
  computed: {

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
