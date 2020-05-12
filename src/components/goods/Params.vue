<template>
    <div>
      <!-- 面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!--警告区域-->
        <el-alert
          title="注意：只允许为第三级菜单设置分类！" type="warning" :closable="false" show-icon>
        </el-alert>
        <!--商品分类区域-->
        <el-row class="cat_opt">
          <el-col>
            <span>商品分类:</span>
              <!--级联选择器-->
              <!--options用来指定数据源-->
              <!--用来指定配置对象-->
              <el-cascader
                v-model="selectKeys"
                :options="cateList"
                :props="{ expandTrigger: 'hover',
                        value:'cat_id',
                        label:'cat_name',
                        children:'children' }"
                @change="handleChange"
                clearable change-on-select>
              </el-cascader>
          </el-col>
        </el-row>
        <!--tab页签区-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="dialogVisible=true">添加参数</el-button>
            <!--动态参数列表-->
            <el-table :data="manyTableData" border stripe>
              <!--展开行-->
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <!--编辑-->
                  <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEdit(scope.row.attr_id)">编辑</el-button>
                  <!--删除-->
                  <el-button type="danger" icon="el-icon-delete" size="mini"  @click="del(scope.row.attr_id)">删除</el-button>
                  </template>
              </el-table-column>

             </el-table>
          </el-tab-pane>

          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="dialogVisible=true">添加属性</el-button>
            <!--静态参数列表-->
            <el-table :data="onlyTableData" border stripe>
              <!--展开行-->
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数列表" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <!--编辑-->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                  <!--删除-->
                  <el-button type="danger" icon="el-icon-delete" size="mini"  @click="del(scope.row.attr_id)" >删除</el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!--添加对话框-->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose">
        <!--提交表单-->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
          <el-form-item :label=titleText prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
      </el-dialog>
      <!--编辑-->
      <el-dialog
        :title="'编辑'+titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editHandleClose">
        <!--提交表单-->
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
          <el-form-item :label=titleText prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
       data(){
         return{
           cateList:[], //拿到商品分类数据
           selectKeys:[],//选中父级分类id数组
           activeName:'many',//被激活的标签
           manyTableData:[],//动态参数数据
           onlyTableData:[],//静态参数数据
           dialogVisible:false,//控制添加对话框显隐
           editDialogVisible:false,//控制编辑对话框显隐
           addForm:{
             attr_name:'',
             activeName:''
           },
           editForm:{

           },
           addRules:{
             attr_name:[
               { required: true, message: '请输入参数名称', trigger: 'blur' },
               { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
             ]
           },
           editRules:{
             attr_name:[
               { required: true, message: '请输入参数名称', trigger: 'blur' },
               { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
             ]
           }
         }
       },
      created(){
          this.getCateList()
      },
      computed:{
         //按钮需禁用为true
        isBtnDisabled(){
          if (this.selectKeys.length!==3){
            return true
          }
         return false
        },
        //动态计算标题文本
        titleText(){
          if (this.activeName==='many') {
            return '动态参数'
          }
          return'静态属性'
        }
      },
      methods:{
        //获取商品分类数据
        async getCateList(){
          const {data: res} = await this.$http.get('categories')
          if (res.meta.status!==200) return this.$message.error('获取商品分类列表失败！')
          this.cateList=res.data;
        },
        //选择框发生变化触发函数
       handleChange(){
          //保证选择级联和tag标签都能获取到数据
        this.getParamsData()
       },
        //tab页签发生变化触发函数
        handleClick(){
          //保证选择级联和tag标签都能获取到数据
          this.getParamsData()
        },
        //当前选中分类的三级分类id
        cateId(){
          if (this.selectKeys.length===3){
            return this.selectKeys[2]
          }
          return null
        },
        //获取参数列表数据
        async getParamsData(){
          //不是三级分类
          if (this.selectKeys.length!==3){
            this.selectKeys=[]
            return
          }
          //是三级分类，根据所选id和当前所处面板，获取对应的参数
          const {data: res} = await this.$http.get(`categories/${this.cateId()}/attributes`,
            {params:{sel:this.activeName}})
          if (res.meta.status!==200) return this.$message.error('获取参数列表失败！')
          console.log(res.data);
          if (this.activeName==='many'){
            this.manyTableData=res.data
          }else{
            this.onlyTableData=res.data
          }
        },
        //重置添加的表单
        handleClose(){
          this.$refs.addFormRef.resetFields();
        },
        addParams(){
          this.$refs.addFormRef.validate(async valid=>{
            if (!valid) return;
            //成功发起添加请求
            const {data :res} =  await this.$http.post(`categories/${this.cateId()}/attributes`,{
              attr_name:this.addForm.attr_name,
              attr_sel:this.activeName
            })
            if (res.meta.status!==201){
              return this.$message.error('添加参数失败')
            }
            this.$message.success('添加参数成功');
            //隐藏对话框
            this.dialogVisible = false
            //重新获取参数列表数据
            this.getParamsData()
          })
        },
        //编辑回显
       async showEdit(attr_id){
          const {data :res} =  await this.$http.get(`categories/${this.cateId()}/attributes/${attr_id}`,{
           params:{
             attr_sel:this.activeName
           }
          })
          if (res.meta.status!==200){
            return this.$message.error('添加参数失败')
          }
          this.$message.success('获取参数成功');
          this.editForm=res.data;
          this.editDialogVisible=true
        },
        //重置编辑表单
        editHandleClose(){
          this.$refs.editFormRef.resetFields();
        },
        editParams(){
          this.$refs.editFormRef.validate(async valid=>{
            if (!valid) return;
            //成功发起添加请求
            const {data :res} =  await this.$http.put(`categories/${this.cateId()}/attributes/${this.editForm.attr_id}`,{
              attr_name:this.editForm.attr_name,
              attr_sel:this.activeName
            })
            if (res.meta.status!==200){
              return this.$message.error('修改参数失败')
            }
            this.$message.success('修改参数成功');
            //重新获取参数列表数据
            this.getParamsData()
            //隐藏对话框
            this.editDialogVisible = false

          })
        },
        //删除
        async del(attr_id){
          const confirmResult=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err =>err);

          if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')
          }
          //请求删除
          const{data:res}=  await this.$http.delete(`categories/${this.cateId()}/attributes/${attr_id}`);
          if (res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功');
          //返回新的数据
          this.getParamsData()
        }
      }

    }
</script>

<style lang="less" scoped>
  .cat_opt{
    margin: 15px 0;
  }

</style>
