<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
     <!-- 搜索区域-->
      <el-row :gutter="20">
        <el-col :span="7"> <el-input v-model="queryInfo.query" clearable @clear="getUserList" placeholder="请输入内容" >
          <el-button  slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input></el-col>
        <el-col :span="4"> <el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
       <!-- 用户列表区域-->
        <el-table :data="userList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" >
              <!--作用域插槽-->
            <template v-slot="scope">
              <!--switch开关-->
              <el-switch v-model="scope.row.mg_state" @change="userStatusChanged(scope.row)" ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <!--编辑-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <!--删除-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)">删除</el-button>
              <!--分配角色-->
              <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)">分配角色</el-button>
              </el-tooltip>
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
        :total="total">
      </el-pagination>
      <!--添加用户对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%" @close="addDialogClosed">
       <!-- 表单验证-->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
      </el-dialog>
      <!--编辑用户对话框-->
      <el-dialog
        title="编辑用户数据"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
        <!-- 添加表单数据-->
        <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名"  >
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
      </el-dialog>
     <!-- 分配权限对话框-->
      <el-dialog
        title="分配权限"
        :visible.sync="rightsDialogVisible"
        width="50%" @close="setRoleDialogClosed">
       <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>

        <span slot="footer" class="dialog-footer">
    <el-button @click="rightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

  </div>

</template>

<script>
  export default {
   data(){
     //校验邮箱
     var checkEmail=(rule,value,cb)=>{
       //正则
        const regEmail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
       if (regEmail.test(value)) {
         return cb()//合法
       }
       cb(new Error('请输入合法邮箱'))
     }
       //校验 手机号
     var checkPhone=(rule,value,cb)=>{
       //正则
       const regPhone=/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
       if (regPhone.test(value)) {
         return cb()//合法
       }
       cb(new Error('请输入合法手机号'))
     }
      return{
        //获取用户列表的参数对象
        queryInfo : {
          query:'',
          pagenum:1,
          pagesize:2
        },
        userInfo:{},//需要分配权限的用户信息
        rolesList:[],//所有角色数据
        userList :[],
        selectedRoleId:'',//选中的角色id
        total:0,
        dialogVisible:false,//添加用户对话框控制显隐
        editDialogVisible:false,//编辑用户对话框显隐
        rightsDialogVisible:false,//分配权限对话框显隐
        editForm:{},//回显查询用户信息
        //添加用户(提交表的数据)
        addForm :{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        addRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator:checkEmail, trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkPhone, trigger: 'blur' }
          ]
        },

      }
   },
    created(){
     this.getUserList()
    },
    methods:{
      async  getUserList(){

      },
      //监听pagesize改变事件并实时更新每页的显示的数据条数
      handleSizeChange(newsize){
        this.queryInfo.pagesize=newsize
        this.getUserList()
      },
      //监听pagenum改变事件
      handleCurrentChange(newpage){
        this.queryInfo.pagenum=newpage
        this.getUserList()
      },
      //监听 switch开关的状态
      async userStatusChanged(userInfo){
      const {data:res}= await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if(res.meta.status!==200){
          userInfo.mg_state=! userInfo.mg_state;
          return this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新用户状态成功！')
      },
      //监听添加用户对话框的关闭事件,重置数据
      addDialogClosed(){
        this.$refs.addFormRef.resetFields();
      },
      editDialogClosed(){
        this.$refs.editFormRef.resetFields();
      },

      //添加用户预校验
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if (!valid) return;
          //成功发起添加请求
       const {data :res} =  await this.$http.post('users',this.addForm)
      if (res.meta.status!==201){
        return this.$message.error('添加用户失败')
      }
          this.$message.success('添加用户成功');
          //隐藏对话框
          this.dialogVisible = false
          //重新获取用户列表数据
          this.getUserList()
        })
      },
      //修改用户对话框
     async showEditDialog(id){
        //拿到对应的数据
       const{data:res}=await this.$http.get('users/'+id)
       if (res.meta.status!==200){
         return this.$message.error('查询用户失败')
       }
       //获取成功并赋值
       this.editForm=res.data
       //对话框出现
      this.editDialogVisible=true
      },
      //修改用户信息并提交
      editUserInfo(){
        this.$refs.editFormRef.validate( async valid=>{
         if (!valid) return;
         //发起修改用户数据请求
        const{data:res}=await  this.$http.put('users/'+this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            })
          if (res.meta.status!==200){
            return this.$message.error('更新失败')
          }
          this.$message.success('添加用户成功');
          //隐藏对话框
          this.editDialogVisible=false;
          //重新获取用户列表数据
          this.getUserList()
        })
      },
      //删除用户
      async  removeById(id){
      const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err);

        if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
        }
        //请求删除
         const{data:res}=  await this.$http.delete('users/'+id);
        if (res.meta.status!==200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功');
        //返回新的数据
        this.getUserList()

      },
      //分配用户权限
     async setRole(userInfo){
        this.userInfo=userInfo;
        //在展示所有对话框之前获取用户数据
          const{data:res}=await this.$http.get('roles')
          if (res.meta.status!==200){
            return this.$message.error('获取角色列表失败')
          }
          this.rolesList=res.data;
        this.rightsDialogVisible=true
      },
      //分配角色
    async  saveRoleInfo(){
        if (!this.selectedRoleId){
          return this.$message.error('请选择要分配的用户')
        }
        const{data:res}=  await this.$http.put(
          `users/${this.userInfo.id}/role`,{
            rid:this.selectedRoleId
          }
        )
        if (res.meta.status!==200){
          return this.$message.error('更新角色失败')
        }
        this.$message.success('更新角色成功');
        this.getUserList()
       this.rightsDialogVisible =false
      },
      //分配角色权限关闭事件
      setRoleDialogClosed(){
        this.selectedRoleId=''
        this.userInfo={}
      }
   }
  }
</script>

<style lang="less" scoped>

</style>
