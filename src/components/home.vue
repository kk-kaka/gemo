<template>
  <div>
    <el-button type="info" @click="loout">退出</el-button>
  </div>
</template>

<script>
export default {
  username: 'kk',
  methods: {
    loout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less"></style>
