# web-RABC-Permissions-sdk

![web-rabc-permissions-sdk](https://s1.ax1x.com/2022/11/23/z3jf0I.md.png)
<p>
后台管理系统RABC通用权限控制规范与规范代码实施js-SDK，包含 节点/按钮/路由 等控制 ，
<br />
支持hidden,disabled，删除，或则自定义function处理。  通过配置实现RABC的权限控制
</p>

<p align="left">
    <img src="https://www.oscs1024.com/platform/badge/liyuec/easyExcelJs.svg" />
    <img src="https://img.shields.io/badge/size-6.56kb-blue" />
    <img src="https://img.shields.io/badge/license-MIT-orange" />
    <img src="https://img.shields.io/badge/converage-50%25-red" />
    <img src="https://img.shields.io/badge/version-1.0.0-lightgrey" />,
</p>

# 目录
<ul>
  <li><a href="#npm-install">npm install</a></li>
  <li><a href="#工程架构总览">工程架构总览</a></li>
  <li><a href="#基本使用">基本使用</a></li>
  <li><a href="#基本options详解">基本options详解</a></li>
  <li>
    <a href="#接口">具体配置含义</a>
    <ul>
    <li><a href="#配置DTO详解">配置DTO详解</a></li>
      <li><a href="#设置原始权限类型与类型包含节点">设置原始权限类型与类型包含节点</a></li>
      <li><a href="#设置权限类型执行顺序">设置权限类型执行顺序</a></li>
      <li><a href="#设置权限生效方案">设置权限生效方案</a></li>
      <li><a href="#设置libraryName">设置libraryName</a></li>
    </ul>
  </li>
  <li><a href="#启动权限">启动权限</a></li>
  <li><a href="#继续开发计划">继续开发计划</a></li>
</ul>


## 工程架构总览[⬆](#目录)<!-- Link generated with jump2header -->

![SDK架构图](https://s1.ax1x.com/2022/11/23/z3WOmQ.png)

###

## npm install
```shell
npm i web-rabc-permissions-sdk -S
```