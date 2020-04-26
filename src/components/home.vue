<template>
    <div>
     <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
  export default {
  methods:{
    logout(){
      //清除token
      window.sessionStorage.clear();
      this.$router.push("/Login");
    }
  }
  }
</script>

<style scoped>

</style>
