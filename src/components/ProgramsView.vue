<template>
  <div>
    {{channels[0]}}
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
