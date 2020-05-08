<template>
    <div>
      <!-- 面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <el-row>
          <el-col > <el-button type="primary" >添加分类</el-button></el-col>
        </el-row>
        <!--树形表格-->
        <tree-table :data="cateList" :columns="columns"
        :selection-type="false" :expand-type="false"
        show-index border >
          <!--是否有效-->
          <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted ===false"
             style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else
             style="color: red;"
          ></i>
          </template>
          <!--分级-->
          <template #order="scope">
         <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
         <el-tag  type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
         <el-tag  type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <!--操作-->
          <template #opt="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
         <el-button  type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>

        </tree-table>
        <!--分页区域-->
      </el-card>
    </div>
</template>

<script>
    export default {
        data(){
          return{
            //提交的查询条件
            queryInfo : {
              type:3,
              pagenum:1,
              pagesize:5
            },
            //拿到商品分类数据
            cateList:[],
            total:0,
            //为table指定列的定义
            columns:[
              {
                label:'分类名称',
                prop:'cat_name'
              },
              {//模板列
                label:'是否有效',
                //把当前列定义为模板列
                type:'template',
                //模板名称
                template:'isOk'
              },
              {//模板列
                label:'排序',
                //把当前列定义为模板列
                type:'template',
                //模板名称
                template:'order'
              },
              {//模板列
                label:'操作',
                //把当前列定义为模板列
                type:'template',
                //模板名称
                template:'opt'
              }
            ]
          }
        },
      created(){
          this.getCateList()
      },
      methods:{
        //获取商品分类数据
       async getCateList(){
          const {data: res} = await this.$http.get('categories', {params:this.queryInfo})
          if (res.meta.status!==200) return this.$message.error('获取商品分类列表失败！')
          this.cateList=res.data.result
          this.total=res.data.total
        }
      }
    }
</script>

<style scoped>

</style>
