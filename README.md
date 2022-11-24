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
  <li><a href="#基本使用与设计思路">基本使用与设计思路</a></li>
  <li><a href="#DEMO地址">DEMO地址</a></li>
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
<li><a href="#工程架构总览与执行简述">工程架构总览与执行简述</a></li>
  <li><a href="#继续开发计划">继续开发计划</a></li>
</ul>

## npm install[⬆](#目录)<!-- Link generated with jump2header -->
```shell
npm i web-rabc-permissions-sdk -S
```

## 基本使用与设计思路[⬆](#目录)<!-- Link generated with jump2header -->
<b>设计思路：</b>
<ul>
    <li>
        每个web应用，初始的button、容器（div）、任意节点都是可见状态。本实例使用RABC设计思想，实现对web端权限进行控制。
    </li>
    <li>
        正常情况下，用户成功登入系统，只需要配置用户不可使用的节点权限即可。
    </li>
    <li>
       <b>角色配置可以在一个.json里，也可以在一个专用的配置系统里，最佳选择在一个配置系统中，通过ajax读取，这样可以做到随时灵活的设置权限</b>
    </li>
    <li>
        非常规情况补充：
        <ol>
            <li>用户A与用户B，同时拥有角色1，但是用户A却需要在角色1的基础上拥有更多特性，则可通过用户A拥有多个角色进行补充;
            </li>
            <li>
                用户A与用户B，同时拥有角色1,但是用户A却需要在不增加新角色的情况下，多一些button的控制，则单独设置havePermiss;
            </li>
            <li>
                用户A与用户B，同时拥有角色1,但是用户A 需要某个时间段不拥有某些权限，则设置specialPermiss;
            </li>
            <li>
                某些角色需要使用特定功能，比如使用<b>vue</b>某个 <template>内的方法或则Data，比如使用用户配置的自定义<b>function</b>
            </li>
        </ol>
    </li>
    <li>
        其中havePermiss 与 noPermiss 会进行 各自的routerPath 与 eleIdOrClass 简单diff判断，进行去重，得到一个以路由为属性的对象，通过当前路由与对象节点匹配，保证执行期间的最小次数。
    </li>
    <li>
        specialPermiss则作为特殊设置，满足特定需求
    </li>
</ul>


```javascript
 
    //基本使用代码如下

    import {webRabcPermisson,getNewPermissionSimpleDTO,PLAN_ENUM,webRabcPermissionSdkOptions} 
    from 'web-rabc-permissions-sdk';
    /*
        webRabcPermissionSdkOptions     ：基本配置
        PLAN_ENUM                       ：执行计划（程序会自动做降级处理)
        getNewPermissionSimpleDTO       ：每个路由下可能存在的权限
        webRabcPermisson                ：实例类
    */

    let _havePermissArr = [],
      _noPermissArr = [],
      _specialArr = [];



    /*
        假设请求一定成功

        一般情况下，只需要配置用户或则对应角色不可拥有的节点
    */
    ajax('get',url,{...userInfo}).then(res=>{
        let {result} = res;
        //用户拥有的权限节点
        _havePermissArr = result.map(i=>{
            //得到实体构建节点对象
            let _permissDTO = new getNewPermissionSimpleDTO();
            //该节点的描述，方便debug理解，可空
            _permissDTO.describe = `该节点的描述，方便debug理解，可空`;
            //该节点ID或则className  其中id为  #id;className为 .className
            _permissDTO.eleIdOrClass = `#id`
            //hidden | removeNode   默认hidden，因为removeNode会直接导致DOM结构变更，可能造成副作用，本期暂未实现
            _permissDTO.resultType = 'hidden'
            //具体路由地址，程序执行会根据路由地址匹配，减少执行次数
            _permissDTO.routerPath = '/c/vuepage1'
            return _permissDTO
        })

        //

    })

```


## 工程架构总览与执行简述[⬆](#目录)<!-- Link generated with jump2header -->

![SDK架构图](https://s1.ax1x.com/2022/11/23/z3WOmQ.png)

### 程序执行步骤简述
<ol>
  <li>程序会在单例模式的基础上，返回现有实例，保证全局唯一。</li>
  <li>通过内部类constructor 缓存最初传入参数与权限节点</li>
  <li>start() </li>
  <li>
    <ol>
        <li>首先会diff掉 拥有权限与没有权限的数据，解决互斥，减少操作DOM的情况。</li>
        <li>根据routerPath 和 eleIdOrClass 进行权限节点是否相同的判断。</li>
        <li>其次判断传入执行计划，若浏览器不支持，则降级为setTimeout作为执行计划。</li>
        <li>若有function执行黑名单，则会throw错误（<b>后续计划</b>)，用户可自由配置不允许操作的范围，比如cookie操作/localStorage操作等</li>
        <li>最终根据执行计划，匹配当前路由与根据routerPath的关系，执行当前权限。</li>
    </ol>
  </li>
  <li>权限根据执行计划执行</li>
</ol>

## 继续开发计划[⬆](#目录)<!-- Link generated with jump2header -->
<ol>
    <li>
        增加sandBox，可选
        <ol>
            <li>黑名单配置</li>
            <li>运行时验证</li>
            <li>start前验证</li>
        </ol>
    </li>
    <li>
        增加微前端模式
    </li>
    <li>
        增加浏览器空闲执行
    </li>
    <li>
        resultType增加removeNode逻辑实现
    </li>
</ol>