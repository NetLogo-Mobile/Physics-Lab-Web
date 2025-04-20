# physics-lab-web

## 本地构建

克隆仓库到本地后，执行 `npm install` 安装依赖，运行 `npm run dev` 启动本地服务器。注意，我们使用的是代理方案解决跨域问题，install 之后报错一个包（kateX）有跨站脚本攻击的风险：我们进行了防护

## 中间层一览

- `getPath.ts`: 使用环境变量在开发环境和生产环境指向了不同的url

- `computedUrl`（不要管这个奇奇怪怪的词法错误.....）用于解耦合，所有physics-static-cn上资源路径的计算都会走这里

## 贡献代码

1. 创建新页面，页面作为一个组件放在./views 下，并且在 vue-router 下配置
2. 创建组件**推荐使用对象传参**，e.g：使用 user 对象而不是 user_id,user_Nickname 等。
3. js 组件使用模块化语法，放在./services，最好做成纯函数
4. 矢量图标库：https://icomoon.io/app/#/select
5. 组件库：https://www.naiveui.com/zh-CN/os-theme/components/t