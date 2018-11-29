<template>
  <div>
    <input type="color" v-model="color">
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      color: '#e66465'
    }
  },
  watch: {
    color (val) {
      alert(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
