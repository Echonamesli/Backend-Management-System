'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  //devServer——在开发环境中，用于自动编译并自动刷新页面，方便开发过程中的调试
  //这样每次写完原代码就不用手动输入指令npx webpack重新打包后才能重新编译代码
  //注：该功能只会在内存中编译打包，不会有任何文件输出，如需更新到生产环境中，还需重新打包代码
  devServer: {   // 开发服务器
    port: port,
    open: true,  // 是否自动打开浏览器
    overlay: {
      warnings: false,
      errors: true
    },
    hot: true,   //模块热替换, 加快开发速度
    //配置代理跨域
    proxy: {
      '/acl': {
        target: 'http://39.98.123.211:8170',   //api文件夹中的请求如果请求路径开头是acl则由代理服务器帮忙转发到这个地址
        pathRewrite: { '^/acl': '' },
      },
      '/product': {
        target: 'http://39.98.123.211:8510',   //api文件夹中的请求如果请求路径开头是product则由代理服务器帮忙转发到这个地址
        pathRewrite: { '^/product': '' }
      }
    },
    //开启mock数据, 这个mock 服务器可能会拦截请求并返回预定义的模拟数据，而不是请求真实的后端接口。
    after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    //关闭webpack4的预提取：它能在浏览器空闲的时候，去加载我们指定的资源。它只会加载资源，并不执行
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, // 拆分前必须共享模块的最小 chunks 数
                  priority: 5,
                  reuseExistingChunk: true //如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
          //开启静态压缩
          config.plugin("CompressionPlugin").use('compression-webpack-plugin', [{
            filename: '[path][base].gz',
            algorithm: 'gzip',
            // 要压缩的文件（正则）
            test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/,
            // 最小文件开启压缩
            threshold: 10240,
            minRatio: 0.8
          }])

        }
      )
  },
}
