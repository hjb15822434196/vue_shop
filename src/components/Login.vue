<template>
  <div class="login_container">
<div class="login_box">
  <!--头像区域-->
  <div class="avater_box">
    <img src="../assets/logo.png">
  </div>
  <!--登录表单区域-->
  <el-form label-width="80px" ref="loginFormRef" :rules="rules" :model="loginForm" class="login_form">

    <div class="login_form_input">
      <el-form-item label="账号：" prop="username" >
      <el-input  v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
    </el-form-item>

      <el-form-item label="密码：" prop="password">
        <el-input  type="password" v-model="loginForm.password"  prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
    </div>

    <el-button type="primary" @click="login">登录</el-button>
    <el-button type="info" @click="resetLoginForm">重置</el-button>

  </el-form>
</div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        //登录表单的数据绑定
        loginForm:{
          username : 'admin',
          password : '123456'
        },
        //表单验证规则
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //重置表单内容
      resetLoginForm(){
        //拿到该表单的引用对象
        this.$refs.loginFormRef.resetFields();
      },
      //对登录表单进行预验证
      login(){
        this.$refs.loginFormRef.validate(async valid =>{
         if (!valid) return;
         //验证成功，请求数据，post请求到promise，利用async（异步）和await（等待）把promise简化，获得到data数据并命名为res
          //这一块可以用.then代替，这里是es6
       const { data:res} = await this.$http.post("login",this.loginForm);
        if (res.meta.status !=200) return this.$message.error('登录失败');
          this.$message.success('登录成功')
          //1.将登陆成功的token保存到客户端的sessionStorage中
          //1.1项目中的其他API除了 登录外 都需要登录后访问
          //1.2 token只在当前页面网站打开期间生效，所以将token保存在sessionStorage中
          sessionStorage.setItem("token",res.data.token);
          //登录成功后跳转
          this.$router.push("/home")
        })
      }
    }
  }
</script>

//lang="less"表示支less语法格式，scoped仅在本组建生效样式
<style lang="less"  scoped>
  .login_container{
  background-color: #2b4b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
  }
  .avater_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    margin-top:-65px;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    } }
  .login_form{
    position: absolute;
    margin-top:100px;
  }
  .login_form_input{
    position: relative;
    margin-left:-145px;
    width: 255%;
  }
</style>
