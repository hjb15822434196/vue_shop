<template>
    <div>
      <!-- 面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!--警告区域-->
        <el-alert
          title="添加商品信息" type="info" center :closable="false" show-icon>
        </el-alert>
        <!--步骤条-->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!--tab栏区域-->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" lable-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                 expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children' }"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的Item项-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!--复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id" label-width="150px">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        </el-form>
      </el-card>
      <!--图片预览-->
      <el-dialog
        title="图片预览"
        :visible.sync="picsDialogVisible"
        width="50%">
        <img :src="previewPath" class="previewPic">
        </el-dialog>
    </div>
</template>

<script>
    export default {
       data(){
         return{
           activeIndex:'0',
           addForm:{
             goods_name:'',
             goods_price:0,
             goods_weight:0,
             goods_number:0,
             //商品分类
             goods_cat:[],
             //图片的数组
             pics:[],
             //商品介绍
             goods_introduce:''
           },
           //动态参数数据
           manyTableData:[],
           //动态参数数据
           onlyTableData:[],
           //商品分类数据
           cateList:[],
           //上传地址
           uploadURL:'http://timemeetyou.com:8889/api/private/v1/upload',
           //预览图片地址
           previewPath:'',
           //图片上传组件的headers请求头对象
           headerObj:{
             Authorization:window.sessionStorage.getItem('token')
           },
           picsDialogVisible:false,
           addRules:{
             goods_name:[
               { required: true, message: '请输入商品名称', trigger: 'blur' },
               { min: 2, max: 10, message: '长度在 2 到10 个字符', trigger: 'blur' }
               ],
             goods_price:[
               { required: true, message: '请输入商品价格', trigger: 'blur' },
               { min: 1, max: 10, message: '长度在 1 到10 个字符', trigger: 'blur' }
             ],
             goods_weight:[
               { required: true, message: '请输入商品重量', trigger: 'blur' },
               { min: 1, max: 10, message: '长度在 1 到10 个字符', trigger: 'blur' }
             ],
             goods_number:[
               { required: true, message: '请输入商品数量', trigger: 'blur' },
               { min: 1, max: 10, message: '长度在 1 到10 个字符', trigger: 'blur' }
             ],
             goods_cat:[
               { required: true, message: '请输入商品分类', trigger: 'blur' }
             ]
           }
         }
       },
      created(){
         this.getCateList()
      },
      computed:{
        //当前选中分类的三级分类id
        cateId(){
          if (this.addForm.goods_cat.length===3){
            return this.addForm.goods_cat[2]
          }
          return null
        }
      },
      methods:{
         //获取商品分类
       async getCateList(){
          const {data: res} = await this.$http.get('categories')
          if (res.meta.status!==200) return this.$message.error('获取商品分类失败！')
          this.$message.success('获取商品分类成功！')
          this.cateList=res.data

       },
        //级联选择器选中项变化，会触发这个函数
        handleChange(){
          if (this.addForm.goods_cat.length!==3){
            this.addForm.goods_cat=[]
          }
        },
        //标签切换函数
        beforeTabLeave(activeName,oldActivaName){
         if (oldActivaName==='0'&& this.addForm.goods_cat.length!==3){
           this.$message.error('请先选择商品分类！')
           return false
         }
        },

      async tabClicked(){
        //商品参数获取
         if (this.activeIndex==='1') {
           //是三级分类，根据所选id和当前所处面板，获取对应的参数
           const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
             {params:{sel:'many'}})
           if (res.meta.status!==200) return this.$message.error('获取动态参数列表失败！')

           res.data.forEach(item=>{
             item.attr_vals=item.attr_vals.length=== 0?
               [] : item.attr_vals.split(' ')
           })
           this.manyTableData=res.data
         }else if(this.activeIndex==='2'){
           //商品属性
           const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
             {params:{sel:'only'}})
           if (res.meta.status!==200) return this.$message.error('获取静态参数列表失败！')
           this.onlyTableData=res.data
         }
      },
        //处理图片预览效果
        handlePreview(file){
        this.previewPath=file.response.data.url
          this.picsDialogVisible=true
        },
        //处理移除图片的操作
        handleRemove(file){
          //1.获取将要删除的图片的临时路径
          const filePath= file.response.data.tmp_path

          //2.从pics数组中，找到这个图片对应的索引值
          const i=this.addForm.pics.findIndex(x=>{
            x.pic===filePath
          })
          //3调用数组的splice方法，把图片信息对象，从pics数组中移除
          this.addForm.pics.splice(i,1)
          console.log(this.addForm);
        },
        //处理图片成功
        handleSuccess(response){
          //1.拼接得到一个图片信息对象
          const picInfo={
            pic:response.data.tmp_path
          }
          // 2.将图片信息对象，push到pics中
          this.addForm.pics.push(picInfo)
          console.log(this.addForm);
        }
       }
    }
</script>

<style lang="less" scoped>
  .el-checkbox{
    margin: 0 6px 0 0 !important;
  }
  .previewPic{
    width: 100%;
  }
  .btnAdd{
    margin-top: 15px;
  }

</style>
