//vue-cli3以后隐藏了webpack配置
// 自定义配置webpack默认配置
module.exports={
  chainWebpack: config=>{
    //上线环境
    config.when(process.env.NODE_ENV==='production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')
    })

    //开发环境
    config.when(process.env.NODE_ENV==='development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
    })

  }


}
