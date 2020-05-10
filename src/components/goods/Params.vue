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
          <el-tab-pane label="动态参数" name="first">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
          </el-tab-pane>

          <el-tab-pane label="静态属性" name="second">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
          </el-tab-pane>
        </el-tabs>

      </el-card>
    </div>
</template>

<script>
    export default {
       data(){
         return{
           cateList:[], //拿到商品分类数据
           selectKeys:[],//选中父级分类id数组
           activeName:'second',//被激活的标签
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
        handleChange(){},
        //tab页签发生变化触发函数
        handleClick(){}
      }
    }
</script>

<style lang="less" scoped>
  .cat_opt{
    margin: 15px 0;
  }

</style>
