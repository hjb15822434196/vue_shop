<template>
    <div>
      <!-- 面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!-- 搜索区域-->
        <el-row :gutter="20">
          <el-col :span="4"> <el-button type="primary">添加用户</el-button></el-col>
        </el-row>
        <!-- 角色列表区域-->
        <el-table :data="roleList" border stripe>
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <!--编辑-->
              <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
              <!--删除-->
              <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
              <!--分配权限-->
              <el-tooltip  effect="dark" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    export default {
        data(){
          return{
            //获取角色权限数据
            roleList:[]
          }
        },
      created(){
         this.getRolesList()
      },
      methods:{
        async  getRolesList(){
         const{data:res}=await this.$http.get('roles')
          if (res.meta.status!==200){
            return this.$message.error('获取角色列表失败')
          }
          this.roleList=res.data;
        }
      }
    }
</script>

<style scoped>

</style>
