//项目发布阶段用到的babel插件
const prodplugins=[]
if (process.env.MOOE_ENV==='production'){
  prodplugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //发布产品时候的插件
    ...prodplugins
  ]
}
