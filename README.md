# Visual

服务器端渲染WEB APP

## 技术栈

- [React]
- [React Router 3.x]
- [Mobx]
- [axios]
- [Sass]
- [PostCSS]
- [Koa 2.x]
- [Webpack 1.x]
- [Babel]
- [Hot Module Replacement]
- [pm2]
- ~~Database~~
- ~~Test Framework~~

## 开始

- 需要Node.jsV6以上版本
- `npm install` 安装依赖
- `npm run dev` 启动开发环境
- `npm run build` 编译文件
- `npm start` 部署生产服务器

## 目录结构

```
visual/                                      // 根目录
├── build/                                   // webpack 配置
│     ├── webpack.dev.config.js                 // DEV环境
│     └── webpack.prod.config.js                // RPD环境
├── client/                                  // 客户端目录
│     ├── config/                               // 配置
│     ├── containers/                           // 页面容器
│     ├── mixin/                                // scss mixin
│     ├── app.js                                // 入口JS
│     ├── app.scss                              // 公共SCSS
│     └── app.state.js                          // 全局State
├── dist/                                    // 编译输出目录
│     ├── client/                               // 客户端
│     └── server/                               // 服务端
├── server/                                  // 服务端目录
│     ├── controllers/                          // 控件器
│     ├── middlewares/                          // 中间件
│     ├── models/                               // models
│     ├── routes/                               // routes
│     ├── app.js                                // 在服务器上创建KOA实例
│     ├── server.dev.js                         // 开发模式下的入口文件
│     └── server.prod.js                        // 生产模式下的入口文件
├── views/                                   // 视图目录
│     ├── dev/                                  // 开发模式下生成的输出文件
│     ├── prod/                                 // 生产模式下生成的输出文件
│     └── tpl                                   // 模板
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## 第三方库
- [antd-mobile]
- [html2canvas]
- [svg.js]
- [f2]
- [validator]
- ~~Phaser~~


## [MIT](https://github.com/jiaoxuebing2014/react-server-render/blob/master/LICENSE)

