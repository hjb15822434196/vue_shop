<template>
    <div>
      <!-- 面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!-- 搜索区域-->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input  placeholder="请输入内容"   clearable >
              <el-button  slot="append" icon="el-icon-search" ></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!-- 商品列表区域-->
        <el-table :data="orderList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格（元）" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发送" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template v-slot="scope">
              <!--|为过滤管道符-->
              {{scope.row.create_time | dataFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <!--区县-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="addDialog"></el-button>
              <!--物流-->
              <el-button type="success" icon="el-icon-location" size="mini"@click="Dialog" ></el-button>
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
      <!--修改地址对话框-->
      <el-dialog
        title="修改地址"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addHandleClose">
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
           <el-cascader :options="cityData" v-model="addForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
      <!--展示物流进度对话框-->
      <el-dialog
        title="物流进度"
        :visible.sync="DialogVisible"
        width="50%">
        <el-timeline >
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
</template>

<script>
  import cityData from './citydata.js'
    export default {
       data(){
         return{
        //获取商品列表的参数对象
           queryInfo : {
             query:'',
             pagenum:1,
             pagesize:10
           },
           //获取的订单数据
           orderList:[],
           total:0,
           addDialogVisible:false,
           //修改地址
           addForm:{
             address1:[],
             address2:''
           },
           addRules:{
             address1:[
               { required: true, message: '请选择省市区', trigger: 'blur' },
             ],
             address2:[
               { required: true, message: '请填写详细地址', trigger: 'blur' },
             ]
           },
           cityData,
           DialogVisible:false,
           //物流数据
           progressInfo:[]
         }
       },
      created(){
      this.getOrderList()
      },
      methods:{
         //获取订单列表
       async getOrderList(){
          const {data: res} = await this.$http.get('orders',
            {params:this.queryInfo
            })
          if (res.meta.status!==200) return this.$message.error('获取订单列表失败！')
          this.$message.success('获取订单列表成功！')
         this.orderList=res.data.goods
         this.total=res.data.total
        },
        //监听pagesize改变事件并实时更新每页的显示的数据条数
        handleSizeChange(newsize){
          this.queryInfo.pagesize=newsize
          this.getOrderList()
        },
        //监听pagenum改变事件
        handleCurrentChange(newpage){
          this.queryInfo.pagenum=newpage
          this.getOrderList()
        },
        //添加地址
        addDialog(){
         this.addDialogVisible=true
        },
        //重置添加的表单
        addHandleClose(){
          this.$refs.addFormRef.resetFields();
        },
        //展示物流对话框
       async Dialog(){
          const {data :res} =  await this.$http.get('/kuaidi/1106975712662')
          if (res.meta.status!==200){
            return this.$message.error('获取物流进度失败')
          }
          this.progressInfo=res.data;
         this.DialogVisible=true
       }
       }
    }
</script>

<style lang="less" scoped>

</style>
