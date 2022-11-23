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
<li><a href="#工程架构总览">工程架构总览</a></li>
  <li><a href="#继续开发计划">继续开发计划</a></li>
</ul>


## 工程架构总览[⬆](#目录)<!-- Link generated with jump2header -->

![SDK架构图](https://s1.ax1x.com/2022/11/23/z3WOmQ.png)

###程序执行大概步骤
[1]程序会在单例模式的基础上，返回现有实例，保证全局唯一。
[2]通过内部类constructor 缓存最初传入参数与权限节点
[3]start() 
    --> 首先会diff掉 拥有权限与没有权限的数据，解决互斥，减少操作DOM的情况。
        ----> 根据routerPath 和 eleIdOrClass 进行权限节点是否相同的判断。
    --> 其次判断传入执行计划，若浏览器不支持，则降级为setTimeout作为执行计划。
    --> 若有function执行黑名单，则会throw错误（<b>后续计划</b>)，用户可自由配置不允许操作的范围，比如cookie操作/localStorage操作等
    --> 最终根据执行计划，匹配当前路由与根据routerPath的关系，执行当前权限。

## npm install
```shell
npm i web-rabc-permissions-sdk -S
```