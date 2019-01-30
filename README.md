# 网易云音乐 for electron
### 本项目使用[electron](https://github.com/electron/electron)、[vue](https://github.com/vuejs/vue)、[electron-vue](https://github.com/SimulatedGREG/electron-vue)、[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

#### 项目结构
```$xslt
├── .electron-vue                  // electron-vue项目webpack主要配置
|    ├── build.config.js           
|    ├── build.js
|    ├── dev-client.js
|    ├── dev-runner.js
|    ├── webpack.main.config.js
|    ├── webpack.renderer.config.js// vue的webpack配置，等同于config/index.js
|    └── webpack.web.config.js
├── api                            // 接口配置
├── build                          // 放置icon
├── dist                           // webpack打包输出目录
├── node_modules
├── src                            // electron-vue应用
|    ├── main                      // electron应用
|    |    ├── index.dev.js         
|    |    └── index.js             // electron配置js文件
|    ├── renderer                  // vue应用
|    |    ├── assets               // vue资源类文件
|    |    ├── components           // vue组件
|    |    ├── pages                // vue页面
|    |    ├── router               // vue-router
|    |    ├── store                // vuex
|    |    ├── App.vue              // vue入口
|    |    └── main.js              // vue配置js文件
|    └── index.ejs                 // vue首页
├── static                         // 静态资源文件
├── temp-file                      // 部分用到的资源（不引入）
├── util                           // 工具类
├── .babelrc
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── package.json
├── README.md
└── yarn.lock
```

#### 错误代码介绍
|错误代码(code)|错误信息(msg)|
|----|----|
|501|帐号不存在|
|502|密码错误|
|702|非信任设备|
|301|需要进行登录操作|
|415|ip高频请求|
|200|请求成功|
|400|上传字段不正确|


#### Build Setup

``` bash
# install dependencies
npm install / yarn

# serve with hot reload at localhost:9080
npm run dev / yarn dev

# build electron application for production
npm run build / yarn build


# lint all JS/Vue component files in `src/`
npm run lint / yarn lint

```

---

