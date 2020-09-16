<template>
  <div id="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout() {
      window.sessionStorage.clear() //清空token
      this.$router.push('/logout') //跳转到登录页
    }
  }
}
</script>

<style lang="less" scoped>
</style>