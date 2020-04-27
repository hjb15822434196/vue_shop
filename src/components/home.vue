<template>

  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/1.jpg" >
        <span>电商后台管理平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <el-menu background-color="#dfdfe0" text-color="#fff" active-text-color="#48a2ff">
          <!--一级菜单--><!--index只能接受String-->
          <el-submenu :index="item.id +'' "  v-for="item in menuList " :key="item.id" >
            <template slot="title">
              <!--图标-->
              <i :class="iconsList[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id" v-for="subItem in item.children" :key="subItem.id">
              <!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span slot="title">{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主页-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>


</template>

<script>
  export default {
    data(){
      return{
        //左侧菜单数据
        menuList: [],
        //一级菜单图标
        iconsList:{
          '125' :'el-icon-user-solid',
          '103' :'el-icon-open',
          '101' :'el-icon-shopping-bag-1',
          '102' :'el-icon-eleme',
          '145' :'el-icon-pie-chart'
        }
      }
    },
    created(){
      this.getMenuList()
    },
     methods:{
      //退出功能
    logout(){
      //清除token
      window.sessionStorage.clear();
      this.$router.push("/Login");
    },
       //获取所有菜单数据
   async getMenuList(){
   const {data : res} = await this.$http.get('menus')
     if (res.meta.status != '200')  return this.$message.error(res.meta.msg)
     this.menuList=res.data
   }
  }
  }
</script>

<style lang="less" scoped>
  .el-header{
    background-color: #353535;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0px;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
      >span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #dfdfe0;
  }
  .el-main{
    background-color: #ffffff;
  }
  .home-container{
    height: 100%;
  }
  .el-header img{
    height: 50px;
    width: 50px;
  }

</style>
