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
          <el-col > <el-button type="primary" @click="showDialog" >添加分类</el-button></el-col>
        </el-row>
        <!--树形表格-->
        <tree-table  class="tableTree" :data="cateList" :columns="columns"
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
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
         <el-button  type="danger" icon="el-icon-delete" size="mini"  @click="removeById(scope.row.cat_id)">删除</el-button>
          </template>

        </tree-table>
        <!--分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 7,10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--添加分类对话框-->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible" width="50%" @close="closeDialog">
        <!-- 添加表单数据-->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name" >
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:" >
            <!--级联选择器-->
            <!--options用来指定数据源-->
            <!--用来指定配置对象-->
            <el-cascader
              v-model="selectKeys"
              :options="FucateList"
              :props="{ expandTrigger: 'hover',
                        value:'cat_id',
                        label:'cat_name',
                        children:'children' }"
              @change="handleChange"
            clearable change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
      </el-dialog>
      <!--编辑对话框-->
      <el-dialog
        title="编辑商品分类"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
        <!-- 添加表单数据-->
        <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="70px">
          <el-form-item label="商品分类">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
      </el-dialog>
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
            //表单提交的数据
            addForm:{
              cat_name:'',
              cat_pid:0,
              cat_level:0
            },
            //编辑回显查询分类信息
            editForm:{},
            //拿到商品分类数据
            cateList:[],
            //父级分类数据
            FucateList:[],
            total:0,
            addDialogVisible:false,//控制对话框显隐
            editDialogVisible:false,//控制编辑对话框
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
            ],
            addRules:{
              cat_name:[
                { required: true, message: '请输入分类名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
                ]
            },
            selectKeys:[],//选中父级分类id数组
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
        },
        //分页
        handleSizeChange(newSize){
         this.queryInfo.pagesize=newSize;
          this.getCateList();
        },
        handleCurrentChange(newPage){
         this.queryInfo.pagenum=newPage;
          this.getCateList();
        },
        //展示添加分类对话框
        showDialog(){
          this.getFuCateList();
         this.addDialogVisible=true;
        },
        //获取商品分类数据
        async getFuCateList(){
          const {data: res} = await this.$http.get('categories', {params:{type:2}})
          if (res.meta.status!==200) return this.$message.error('获取父级分类列表失败！')
          this.FucateList=res.data
        },
        //选择项发生变化触发函数
        handleChange(){
          if (this.selectKeys.length>0){
            //父级分类id
            this.addForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
            //为当前分类等级赋值
            this.addForm.level=this.selectKeys.length;
            return
          }else{
            //父级分类id
            this.addForm.cat_pid=0
            //为当前分类等级赋值
            this.addForm.level=0
          }
        },
        //添加分类数据
        addCate(){
          this.$refs.addFormRef.validate(async valid=>{
            if (!valid) return;
            //成功发起添加请求
            const {data :res} =  await this.$http.post('categories',this.addForm)
            if (res.meta.status!==201){
              return this.$message.error('添加分类失败')
            }
            this.$message.success('添加分类成功');
            //隐藏对话框
            this.addDialogVisible = false
            //刷新列表
            this.getCateList()
          })
        },
        //监听对话框关闭事件，重置数据
        closeDialog(){
          this.$refs.addFormRef.resetFields()
          this.selectKeys=[]
          this.addForm.cat_level=0
          this.addForm.cat_pid=0
        },
        //编辑回显
        async showEditDialog(id){
          //拿到对应的数据
          const{data:res}=await this.$http.get('categories/'+id)
          if (res.meta.status!==200){
            return this.$message.error('查询角色失败')
          }
          //获取成功并赋值
          this.editForm=res.data
          //对话框出现
          this.editDialogVisible=true
        },
        //修改角色信息并提交
        editUserInfo(){
          this.$refs.editFormRef.validate( async valid=>{
            if (!valid) return;
            //发起修改用户数据请求
            const{data:res}=await  this.$http.put('categories/'+this.editForm.cat_id,
              {
                cat_name: this.editForm.cat_name,
              })
            if (res.meta.status!==200){
              return this.$message.error('更新失败')
            }
            this.$message.success('修改成功');
            //隐藏对话框
            this.editDialogVisible=false;
            //重新获取用户列表数据
            this.getCateList()
          })
        },
        //监听编辑对话框的关闭事件,重置数据
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },
        //删除角色
        async  removeById(id){
          const confirmResult=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err =>err);

          if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')
          }
          //请求删除
          const{data:res}=  await this.$http.delete('categories/'+id);
          if (res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功');
          //返回新的数据
          this.getCateList()

        }
      }
    }
</script>

<style lang="less" scoped>
.tableTree{
  margin-top: 15px;
}
  .el-cascader{
    width:100%
  }
</style>
