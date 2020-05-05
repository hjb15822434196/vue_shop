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
          <el-col :span="4"> <el-button type="primary" @click="dialogVisible = true">添加角色</el-button></el-col>
        </el-row>
        <!-- 角色列表区域-->
        <el-table :data="roleList" border stripe>
          <!--展开列-->
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-row class="vcenter" :class="['bdbottom',index1===0? 'bdtop':'']"  v-for="(item1,index1) in scope.row.children" :key="item1.id" >
                <!--渲染一级菜单-->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--渲染二级和三级菜单-->
                <el-col :span="19">
                  <el-row  class="vcenter" :class="[index2===0? '':'bdtop']" v-for="(item2,index2) in item1.children" :key="item2.id">
                    <!--二级-->
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!--三级-->
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <!--编辑-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <!--删除-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)">删除</el-button>
              <!--分配权限-->
              <el-tooltip  effect="dark" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--添加角色对话框-->
        <el-dialog
          title="添加角色"
          :visible.sync="dialogVisible"
          width="50%" @close="addDialogClosed">
          <!-- 表单验证-->
          <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
            <el-form-item label="角色编号" prop="roleId">
              <el-input v-model="addForm.roleId"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>

        <!--编辑角色对话框-->
        <el-dialog
          title="编辑角色数据"
          :visible.sync="editDialogVisible"
          width="50%" @close="editDialogClosed">
          <!-- 表单验证-->
          <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="80px">
            <el-form-item label="角色编号"  >
              <el-input v-model="editForm.roleId" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>
        <!--分配权限对话框-->
        <el-dialog
          title="分配权限"
          :visible.sync="rightDialogVisible"
          width="50%"
        @close="setRightsDialogClosed">
          <!-- 树形控件-->
          <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
          <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="rightDialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
    export default {
        data(){
          return{
            //获取角色数据
            roleList:[],
            //获取权限数据
            rightsList:[],
            //树形控件绑定的属性
            treeProps:{
              label:'authName',
              children:'children'
            },
            //默认选中节点Id值数组
            defKeys:[],
            //添加角色(提交表的数据)
            addForm :{
              roleId:'',
              roleName:'',
              roleDesc:'',
            },
            editForm:{},//回显查角色信息
            dialogVisible:false,//添加角色对话框控制显隐
            editDialogVisible:false,//编辑角色对话框显隐
            rightDialogVisible:false,//分配权限对话框显隐
            addRules:{
              roleName:[
                { required: true, message: '请输入角色名名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
              ],
              roleDesc:[
                { required: true, message: '请输入角色描述', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
              ],
              roleId:[
                { required: true, message: '请输入角色编号', trigger: 'blur' },
                { min: 1, max: 3, message: '长度在 1 到3 个字符', trigger: 'blur' }
              ]
            }

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
        },
        //监听添加角色对话框的关闭事件,重置数据
        addDialogClosed(){
          this.$refs.addFormRef.resetFields();
        },
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },
        //添加角色预校验
        addUser(){
          this.$refs.addFormRef.validate(async valid=>{
            if (!valid) return;
            //成功发起添加请求
            const {data :res} =  await this.$http.post('roles',this.addForm)
            if (res.meta.status!==201){
              return this.$message.error('添加角色失败')
            }
            this.$message.success('添加角色成功');
            //隐藏对话框
            this.dialogVisible = false
            //重新获取用户列表数据
            this.getRolesList()
          })
        },
        //修改角色对话框
        async showEditDialog(id){
          //拿到对应的数据
          const{data:res}=await this.$http.get('roles/'+id)
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
            const{data:res}=await  this.$http.put('roles/'+this.editForm.roleId,
              {
                roleName: this.editForm.roleName,
                roleDesc: this.editForm.roleDesc
              })
            if (res.meta.status!==200){
              return this.$message.error('更新失败')
            }
            this.$message.success('添加角色成功');
            //隐藏对话框
            this.editDialogVisible=false;
            //重新获取用户列表数据
            this.getRolesList()
          })
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
          const{data:res}=  await this.$http.delete('roles/'+id);
          if (res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功');
          //返回新的数据
          this.getRolesList()

        },
        //根据id删除对应的权限
       async removeRightById(role,rightId){
          const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err =>err);

          if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')
          }
          //请求删除
          const{data:res}=  await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
          if (res.meta.status!==200){
            return this.$message.error('删除用户权限失败')
          }
          this.$message.success('删除成功');
         //返回新的数据
        role.children=res.data

        },
        //分配权限对话框
        async showSetRightDialog(role){
        const {data:res}= await this.$http.get('rights/tree')
          if (res.meta.status!==200){
            return this.$message.error('删除权限数据失败')
          }
          this.rightsList=res.data;
          this.getLeafKeys(role,this.defKeys)
          this. rightDialogVisible=true
        },
        //通过递归获取角色下的三级权限的id并保存在defKeys中
        getLeafKeys(node,arr){
          //三级节点
          if (!node.children) {
            return arr.push(node.id)
          }
          //不是三级节点
          node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
          })
        },
        setRightsDialogClosed(){
          this.defKeys=[]
        }
        }
    }
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop{
  border-top: 1px solid #eee;
}
  .bdbottom{
   border-bottom: 1px solid #eee;
 }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
