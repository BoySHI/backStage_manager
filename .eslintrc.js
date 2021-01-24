 // eslint 代码规范校验工具的配置文件 该文件如果修改必须重启才能生效
 module.exports = {
     root: true,
     env: {
         node: true
     },
     'extends': [
         'plugin:vue/essential',
         'eslint:recommended'
     ],
     parserOptions: {
         parser: 'babel-eslint'
     },
     rules: {
         // process.env.NODE_ENV === 'production'是用来判定代码运行的环境
         // 开发时是开发环境：npm run serve 启动项目
         // 打包上线部署是 npm run build 构建生产环境运行代码
         'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
         'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
     }
 }