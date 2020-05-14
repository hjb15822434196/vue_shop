<template>
    <div>
      <!-- 面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!-- 搜索区域-->
        <el-row :gutter="20">
          <el-col :span="7"> <el-input  placeholder="请输入内容" >
            <el-button  slot="append" icon="el-icon-search" ></el-button>
          </el-input>
          </el-col>
          <el-col :span="4"> <el-button type="primary">添加商品</el-button></el-col>
        </el-row>
        <!-- 商品列表区域-->
        <el-table :data="goodList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
          <el-table-column label="创建时间" prop="add_time">
            <template v-slot="scope">
              <!--|为过滤管道符-->
              {{scope.row.add_time | dataFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <!--编辑-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <!--删除-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background>
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
    export default {
       data(){
        return{
          //获取商品列表的参数对象
          queryInfo : {
            query:'',
            pagenum:1,
            pagesize:2
          },
          //获取的商品数据
          goodList:[],
          total:0,
        }
       },
      created(){
         this.getGoodsList()
      },
      methods:{
         //获取商品列表数据
       async getGoodsList(){
          const {data: res} = await this.$http.get('goods',
            {params:this.queryInfo
            })
          if (res.meta.status!==200) return this.$message.error('获取商品列表失败！')
         this.$message.success('获取商品列表成功！')
          this.goodList=res.data.goods
          this.total=res.data.total
       },
        //监听pagesize改变事件并实时更新每页的显示的数据条数
        handleSizeChange(newsize){
          this.queryInfo.pagesize=newsize
          this.getGoodsList()
        },
        //监听pagenum改变事件
        handleCurrentChange(newpage){
          this.queryInfo.pagenum=newpage
          this.getGoodsList()
        },
      }
    }
</script>

<style scoped>

</style>
