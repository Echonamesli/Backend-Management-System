import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter , asyncRoutes, anyRoutes} from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes:[],
    roles:[],
    buttons:[],
    //与服务器返回的标识进行对比之后最终需要展示的异步路由
    resultAsyncRoutes:[],
    //最终的异步路由+常量路由+任意路由=最终路由
    resultAllRoutes:[] 
  }
}

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

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
   //存储用户信息
   SET_USERINFO:(state,userInfo)=>{
    //用户名
     state.name = userInfo.name;
     //用户头像
     state.avatar = userInfo.avatar;
     //菜单权限标记
     state.routes = userInfo.routes;
     //按钮权限标记
     state.buttons = userInfo.buttons;
     //角色
     state.roles = userInfo.roles;
  },
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //console.log(state,asyncRoutes);
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = anyRoutes.concat(state.resultAsyncRoutes)
    //给项目路由添加最终路由
    // state.resultAllRoutes.forEach(route => {
    //   router.addRoute(route)
    // })
    // resetRouter()
    // console.log('正在addRoutes.......');
    router.addRoutes(cloneDeep(state.resultAllRoutes))
  }
}



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

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response;          

        //vuex存储用户全部的信息
        commit('SET_USERINFO',data);

        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes,data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

