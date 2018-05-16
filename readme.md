#### 概述：此项目是一个舆情监控系统，用户可以添加舆情方案来查询网络上关于关键词的舆情，并且提供预警功能

#### 工作流程：前后端分离，前端本地直接ajax调用后端接口。

#### API地址：http://10.21.168.57/wiki/doku.php?id=yibansa
#### 调用方法参考后面Balm配置里的proxyTable

#### 技术栈: Vue + Vuex + Vue-Router + Balm

### Start

```
cd frontend
npm install
npm run dev
```

### 打包

```
cd frontend
npm run prod
```

目录结构：
- app
  - data 静态json数据
  - images 图片目录
  - scripts
  - scripts config 请求统一路由配置
  - scripts lib 一些库
  - scripts router vue路由
  - scripts store vuex
  - scripts views vue模板逻辑
  - styles 样式main.scss入口

- dist 打包静态文件
- assets 打包后端使用
- gulpfile.js Balm配置
- balmrc.js Balm配置，调试接口代理用[proxyTable]

### 相关链接
Balm配置：[https://github.com/balmjs/balm](http://note.youdao.com/)

Balm配置可以询问应用研发部的倪俊老师【易班FEQQ群：群号:424710517】
