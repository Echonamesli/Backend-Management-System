# 文件结构说明
1) build
    -----index.js webpack配置文件（很少修改）
2）src
    -----permisssion.js: 与导航守卫相关
    -----settings：项目配置项文件
3) .env.development  .env.production  .env.production是不同环境（开发、生产、测试）下的环境变量配置文件
    main.js——输入 console.log(process.env); （webpack通过process.env获取） 则可以自动检测当前是什么环境并获取对应环境的变量