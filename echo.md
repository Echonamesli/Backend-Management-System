# 文件结构说明
1) build
    -----index.js webpack配置文件（很少修改）
2）src
    -----permisssion.js: 与导航守卫相关
    -----settings：项目配置项文件
3) .env.development  .env.production  .env.production是不同环境（开发、生产、测试）下的环境变量配置文件
    main.js——输入 console.log(process.env); （webpack通过process.env获取） 则可以自动检测当前是什么环境并获取对应环境的变量

4) package.json
    "scripts": {
        "dev": "vue-cli-service serve",
        "build:prod": "vue-cli-service build",
        "build:stage": "vue-cli-service build --mode staging",
        "preview": "node build/index.js --preview",
        "svgo": "svgo -f src/icons/svg --config=src/icons/svgo.yml",
        "lint": "eslint --ext .js,.vue src",
        "test:unit": "jest --clearCache && vue-cli-service test:unit",
        "test:ci": "npm run lint && npm run test:unit"
    },

    打包命令： npm run build:prod

    说明：  NODE_ENV默认是development
            npm run build:prod 构建出来的是生产环境的应用，生成的包会比较小，NODE_ENV=production
            npm run build:stage构建出来的是测试环境的应用，NODE_ENV=staging

# 编程技巧
##  SPU部分下面共三个部分在切换，因为分成三个div，绑定v-shoiw，设置scene有三个值：0、1、2
##  子组件有很多初始化数据，需要每次当子组件展示的时候就发请求获取数据————子组件写好initData事件，父组件通过ref获取子组件，父组件：this.$refs.spu.initSpuData()
## 可以在服务器返回的数据对象身上绑定临时属性，以便之后提交服务器数据的时候可以利用这个临时属性生成对象返回给服务器
    attr：服务器返回的数据对象， 给它绑定attrIdAndValueId
    很多个单选框，有选中的对象身上就会有attrIdAndValueId属性
    保存提交给服务器的时候服务器需要的是attrIdAndValueId转变而成的对象
    ps: el-select多选框可以穿多个数据，拼接一下即可
     <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
     <el-option
        :label="attrValue.valueName"
        v-for="(attrValue,index) in attr.attrValueList"
        :key="attrValue.id"
        :value="`${attr.id}:${attrValue.id}`"
        ></el-option>
    </el-select>


## 取消按钮，清除数据的方法
        cancel(){
            //点击取消按钮，清除数据
            // Object.assign:es6中新增的方法，可以合并对象
            //组件实例this._data可以操作data当中的响应式数据
            //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
            Object.assign(this._data,this.$options.data())
            //console.log(this._data,this.$options.data(),'this.$options');
        },
## 必要的时候form表单项el-form-item中可以放新的form

## 父组件的样式是scoped：
    子组件的根标签（比如h3）如果能在父组件的样式中（比如h3{color: red}）找到一样的，就会添加上父组件的样式
    其余情况如果父组件还想影响子组件的样式，就需要使用深度选择器
    css： >>>
    less:  /deep/
    scss:  ::v-deep

    >>> .el-carousel__button {
        width: 10px;
        height: 10px;
        background: red;
        border-radius: 50%;
    }

# 后台管理系统亮点

## echarts

## mock: mock文件夹下的data.json+home.js + utils文件夹下的mockRequest.js
### 自己mock了退出登录的接口
    
    //这个接口是在mock（mock-server文件里定义了基础路径是process.env.VUE_APP_MOCK_API）下的user写的模拟接口。
    //所以要用mockRequest发起请求(baseURL: process.env.VUE_APP_MOCK_API也就是mock-api)
    export function logout() {
    return mockRequest({
        url: '/vue-admin-template/user/logout',
        method: 'post'
    })
    }

    // 退出登录按钮的回调函数
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
            removeToken()  // 先移除token, 其实就是Cookies.remove(TokenKey)
            resetRouter()  //清除动态路由, 重置matcher可达到路由还原效果
            commit('RESET_STATE')
            resolve()
        }).catch(error => {
            reject(error)
        })
        })
    },

### 自己mock了首页柱状图展示的数据
    mock/home.js

## 权限管理 
    思路：不同用户是不一样的角色（包括管理员、产品经理、运维、媒体宣传等角色）
          不同角色是不一样的权限（细分为三级，包括权限管理、商品管理（分类管理(添加分类、修改分类、删除分类)、订单管理、优惠管理(优惠券管理(添加优惠券、修改优惠券))、平台属性管理....）、订单管理、客户管理、优惠管理等权限）

### 菜单权限：不同用户可以看见的菜单不一样

    路由分成三部分：
        异步路由：部分展示——权限管理、商品管理、测试管理
        常量路由：不管什么用户/角色可以去——登录、首页、访问404
        任意路由：路径错误*就重定向到404——anyRoutes

    思路：route开始只配置了常量路由 + 异步路由和后端返回的进行比较筛选 + 任意路由 =addRoutes注入到最终的router

    超级管理员 账号：admin  密码：111111     ————筛选出两个异步路由,可以看见首页、权限管理(用户管理、角色管理、菜单管理)、商品管理(平台属性管理、spu管理、sku管理)、测试管理

    普通员工   账号：echo 密码： 123456   ————筛选出的异步路由只有测试管理，所以看见的只是常量路由里的首页和测试管理

    1）点击登录按钮，登录成功，返回token，就通过调用vuex存储token，并调用action方法存储token到Application的cookie里面
        const actions = {
            // user login
            async login({ commit }, userInfo) {
                const { username, password } = userInfo
                let result = await login({ username: username.trim(), password: password })
                if(result.code == 20000){
                commit('SET_TOKEN', result.data.token)
                setToken(result.data.token)
                return 'ok'
                }else{
                return Promise.reject(new Error('faile'))
                }
            },

        Cookies.get(TokenKey)  
        Cookies.set(TokenKey, token)
        Cookies.remove(TokenKey)

    2）permission.js(main.js里会引入使其生效)——对项目的路由写了全局前置守卫
        router.beforeEach：
            如果已经有token:
                要去login，则重定向到/
                是否已经有用户信息，有就放行，没有就获取用户信息——获取用户信息失败的话就清除token并让用户重新登陆
            如果没有token：
                访问路径不包含/login——用户需重新登陆
                访问路径包含/login——放行

    3）登陆完后则带着token发起getInfo请求——获取userInfo对象：routes数组（不同用户左侧应该展示哪些菜单）、buttons数组（按钮权限，有的按钮有的用户是没有的）、roles（该用户有哪些角色）、用户名name、用户头像avatar
    routes数组是由后端返回用户的权限，根据它来动态配置路由,vue-router提供了两个方法router.addRoutes()可以进行动态路由添加
        //定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
        const computedAsyncRoutes = (asyncRoutes,routes)=>{
            //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
            return asyncRoutes.filter(item=>{
                //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1 
                if(routes.indexOf(item.name)!=-1){
                //递归:别忘记还有2、3、4、5、6级路由
                if(item.children&&item.children.length){
                    item.children = computedAsyncRoutes(item.children,routes);
                }
                return true;
                }
            })
        }
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
        router.addRoutes(cloneDeep(state.resultAllRoutes))

    4）这里需要注意的是vue-router的options属性存放的是路由配置的信息，并不是响应式的，在动态添加路由规则后，router.options.routes属性不会  变，如果需要更新router.options.routes，则需要手动更改。
        sidebar这里左侧菜单栏的展示：
        routes() {
            //这个是初始定义的路由，是不会自动响应式变化的
            //return this.$router.options.routes
            //应该改成仓库计算完毕的最终路由
            return this.$store.state.user.resultAllRoutes
        },
        //根据筛选出的每个路由对象有没有meta.title决定左侧展示与否
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />

### 按钮权限：不同用户可以看见的按钮不一样
        admin是超级管理：拥有所有按钮的权限——可以看到测试管理1的添加按钮1和添加按钮2、测试管理2的添加按钮3
        echo是普通管理：拥有部分按钮的权限——可以看到测试管理1的添加按钮1、测试管理2的添加按钮3

        <el-button type="primary"  v-show="$store.state.user.buttons.indexOf('btn.Add2')!=-1">添加按钮2</el-button>

## 优化

### 项目打包之后产生的js文件有很多
    修改webpack的optimization.SplitChunks配置项进行自动分包

    对不同的缓存组设置不同的分包策略：
        1、将来自 node_modules 目录的第三方库（第三方依赖）打包到一个名为 chunk-libs 的块中
        2、将 element-ui 库打包到一个名为 chunk-elementUI 的块中，并定义优先级最高
        3、将src/components也即一些公共的自定义组件（前提是该模块至少被chunk引用了3次）打包到一个名为 chunk-commons 的块中

    ps：其实再怎么分包总体积都是不变的，只是拆分了很多份，但分包的最大好处是复用缓存
    观察会发现，每一个分包后的chunk比如dist\static\js\chunk-libs.bb51e48f.js，打开它会发现里面第一行是(window.webpackJsonp = window.webpackJsonp || []).push(序号索引)，也就是说按照分出来的顺序，这些包都会push到同一个window.webpackJsonp数组中，然后要用到这些chunk就去数组中拿。

### 配置webpack的runtimeChunk——为了线上更新版本时，充分利用浏览器缓存，使用户感知的影响到最低。
    1） config.optimization.runtimeChunk('single')——会为入口添加一个额外 chunk，它是一个在所有生成 chunk 之间共享的运行时文件（chunk之间互相引用的hash值）

    每次生成的app的chunk的hash都不变：
    dist\static\js\app.25fd649e.js   54.00 KiB  17.41 KiB

    设置runtimeChunk是将包含chunks 映射关系的 list单独从 app.js里提取出来，因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以每次改动都会影响它，如果不将它提取出来的话，等于app.js每次都会改变。对于app.js的缓存就失效了
    设置runtimeChunk之后，webpack就会生成一个个runtime~xxx.js的文件——就是加载chunk依赖关系的文件。然后每次更改的只是所谓的运行时代码文件时，打包构建时app.js的hash值是不会改变的

    2）此时存在另一个问题：虽然每次构建后app的hash不变，但runtime~xxx.js会变，每次重新构建上线后，浏览器每次都需要重新请求它，所以不要将它单独拆包，而是将它内联到我们的 index.html 之中————使用script-ext-html-webpack-plugin

        config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()

    3） 查看dist/index.html：发现index.html中已经没有对runtime~xxx.js的引用了，而是直接将其代码写入到了index.html中，故不会在请求文件，减少http请求



### webpack开启静态压缩   
    注意：这种情况不代表有压缩，右侧只是vscode的建议
    File                                      Size             Gzipped   
    dist\static\js\chunk-4cf9dda4.88500a8b    844.65 KiB       291.90 KiB

    npm i compression-webpack-plugin@6.1.0 -D 
    
    开启压缩后确实被压缩到了291.9KB！

# 菜人踩坑

## 动态路由刷新后页面空白
    因为项目是动态路由：初始的router/index.js是常量路由，在user仓库里获取用户信息的时候会把异步路由存起来并进行筛选整合，得到最终的异步路由并addRoutes
    问题原因：页面刷新之后store里面的数据就会清空, beforeEach钩子里每次都会判断仓库里name信息，如果没有的话就去发请求获取仓库数据并添加动态路由，并且要在动态路由加载完之后 调用——next({path:to.fullPath})从而完成跳转

## vue-router3版本报错
    vue-router.esm.js:2066 Uncaught (in promise) Error: Navigation cancelled from "/login?redirect=%2Fdashboard" to "/dashboard" with a new navigation.
    这个错误是 vue-router 内部错误，没有进行 catch 处理，导致的编程式导航跳转问题，向同一地址跳转时会报错的情况（push 和replace 都会导致这个情况的发生）ps: 声明式导航之所以不会出现这种问题，是因为vue-router在内部已经做了相关处理。
    解决方法一：安装 vue-router 3.0 以下版本，先卸载 3.0 以上版本然后再安装旧版本————no
    解决方法二：针对于路由跳转相同的地址添加 catch 捕获一下异常
    解决方法三：重写路由的push和replace方法
            // 解决编程式路由往同一地址跳转时会报错的情况
            const originalPush = VueRouter.prototype.push;
            const originalReplace = VueRouter.prototype.replace;

            // push
            VueRouter.prototype.push = function push(location, onResolve, onReject) {
            if (onResolve || onReject)
                //return originalPush.call(this, location, onResolve, onReject);
                return originalPush.call(this, location).catch(err => err);
            };

            //replace
            VueRouter.prototype.replace = function push(location, onResolve, onReject) {
            if (onResolve || onReject)
                //return originalReplace.call(this, location, onResolve, onReject);
                return originalReplace.call(this, location).catch(err => err);
            };

## 解决报错

在谷歌浏览器中，使用element-plus的一些表单组件时，会报如下错误：[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952（将非被动事件侦听器添加到滚动阻止的“touchstart”事件中。请考虑将事件处理程序标记为“被动”，以提高页面的响应能力）

当属性passive的值为true的时候，代表该监听器内部不会调用preventDefault函数来阻止默认滑动行为，Chrome浏览器称这类型的监听器为被动（passive）监听器。目前Chrome主要利用该特性来优化页面的滑动性能

当应用中用到滚动事件scroll、滚轮事件wheel或者移动端touchstart/touchmove/touchend等事件时会报这样的警告，通过排查我的项目中是在使用了：TimePicker 时间选择器组件、DatePicker 日期选择器组件和Input Number 数字输入框等组件时会报这样的错误。

网上提供了两种解决方案是，我们先说第一种：
安装default-passive-events插件。然后再在main.js中进行引入： import 'default-passive-events'
