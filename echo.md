# 文件结构说明
1) build
    -----index.js webpack配置文件（很少修改）
2）src
    -----permisssion.js: 与导航守卫相关
    -----settings：项目配置项文件
3) .env.development  .env.production  .env.production是不同环境（开发、生产、测试）下的环境变量配置文件
    main.js——输入 console.log(process.env); （webpack通过process.env获取） 则可以自动检测当前是什么环境并获取对应环境的变量


# 编程知识
##  SPU部分下面共三个部分在切换，因为分成三个div，绑定v-shoiw，设置scene有三个值：0、1、2
## 子组件有很多初始化数据，需要每次当子组件展示的时候就发请求获取数据————子组件写好initData事件，父组件通过ref获取子组件，父组件：this.$refs.spu.initSpuData()
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

