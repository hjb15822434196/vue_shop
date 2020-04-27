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
      <el-aside :width = "isCollapse? '64px'  :  '200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 开启路由定位:router="true"-->
        <el-menu background-color="#dfdfe0" text-color="black" active-text-color="#48a2ff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
          <!--一级菜单--><!--index只能接受String-->
          <el-submenu :index = "item.id + '' "  v-for="item in menuList " :key="item.id" >
            <template slot="title">
              <!--图标-->
              <i :class="iconsList[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <!--路由自动定位地址:index =" '/'+subItem.path + '' "-->
            <el-menu-item :index =" '/'+subItem.path + '' " v-for="subItem in item.children" :key="subItem.id">
              <!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span slot="title">{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主页-->
      <el-main>
        <!-- 路由占位符-->
        <router-view></router-view>
      </el-main>
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
        },
        //是否折叠
        isCollapse : false
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
      },
      //侧边栏折叠效果
      toggleCollapse(){
        this.isCollapse = !this.isCollapse;
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
    .el-menu{
      border-right:none;
    }
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
  .toggle-button{
    background-color: #909399;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
</style>
