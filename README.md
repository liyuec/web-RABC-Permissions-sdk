# web-RABC-Permissions-sdk

![web-rabc-permissions-sdk](https://s1.ax1x.com/2023/02/06/pSckAHg.png)
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
  <li><a href="#具体使用的DEMO地址">具体使用的DEMO地址</a></li>
  <li>
    <a href="#具体配置含义">具体配置含义</a>
    <ul>
    <li><a href="#plan_enum可选">PLAN_ENUM（可选）</a></li>
      <li><a href="#ACTION_ORDER可选">ACTION_ORDER（可选）</a></li>
      <li><a href="#permissionSimpleDTO必选">permissionSimpleDTO（必选）</a></li>
      <li><a href="#webRabcPermissionSdkOptions必选">webRabcPermissionSdkOptions（必选）</a></li>
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
    </li>
    <li>
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
                某些角色需要使用特定功能，比如使用<b>vue</b>某个 "template"内的方法或则Data，比如使用用户配置的自定义<b>function</b>
            </li>
        </ol>
    </li>
</ul>
<ul>
    <li>
        其中havePermiss 与 noPermiss 会进行 各自的routerPath 与 eleIdOrClass 简单diff判断，进行去重，得到一个以路由为属性的对象，通过当前路由与对象节点匹配，保证执行期间的最小次数。
    </li>
    <li>
        specialPermiss则作为特殊设置，满足特定需求
    </li>
</ul>


```js
 
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
        //角色 拥有的权限节点
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

        //角色 不可拥有节点
        _noPermissArr= result.map(i=>{
            //得到实体构建节点对象
            let _permissDTO = new getNewPermissionSimpleDTO();
            //该节点的描述，方便debug理解，可空
            _permissDTO.describe = `该节点的描述，方便debug理解，可空`;
            //该节点ID或则className  其中id为  #id;className为 .className
            _permissDTO.eleIdOrClass = `.className`
            //hidden | removeNode   默认hidden，因为removeNode会直接导致DOM结构变更，可能造成副作用，本期暂未实现
            _permissDTO.resultType = 'hidden'
            //具体路由地址，程序执行会根据路由地址匹配，减少执行次数
            _permissDTO.routerPath = '/c/vuepage1'
            return _permissDTO
        })

                //角色 不可拥有节点
        _specialArr= result.map(i=>{
            //得到实体构建节点对象
            let _permissDTO = new getNewPermissionSimpleDTO();
            //该节点的描述，方便debug理解，可空
            _permissDTO.describe = `该节点的描述，方便debug理解，可空`;
            //该节点ID或则className  其中id为  #id;className为 .className
            _permissDTO.eleIdOrClass = `.className`
            //hidden | removeNode   默认hidden，因为removeNode会直接导致DOM结构变更，可能造成副作用，本期暂未实现
            _permissDTO.resultType = 'hidden'
            //具体路由地址，程序执行会根据路由地址匹配，减少执行次数
            _permissDTO.routerPath = '/c/vuepage1'
            return _permissDTO
        })

        webRabcPermissionSdkOptions.havePermiss = _havePermissArr;
        webRabcPermissionSdkOptions.noPermiss = _noPermissArr;
        webRabcPermissionSdkOptions.specialPermiss = _specialArr;

        //执行计划  MutationObserver or setTimeout
        webRabcPermissionSdkOptions.plan = PLAN_ENUM.OB_SERVER;
        //对象框架  目前支持获取vue this, react也适用，但是不能获取到某个react组件下的this
        webRabcPermissionSdkOptions.libraryName = 'vue'
        let _webRabc = new webRabcPermisson(webRabcPermissionSdkOptions);

        //启动权限
        _webRabc.start({
        //执行时间
        millisec:500, 
        //obServer的执行节点设置
        obServerConfig:{
                attributes:false,
                childList:true,
                subtree:true,
                characterData:false
            },
        //节流时间
        delay:500,
        //必须指定一个observer的容器节点，必须是ID
        obElem:'app'
        });

    })

    //debug时 获取执行情况
     console.dir(_webRabc.getSdkInfo())

```


## 具体使用的DEMO地址[⬆](#目录)<!-- Link generated with jump2header -->
<a href="https://github.com/liyuec/web-RABC-Permissions-sdk-DEMO">web-RABC-Permissions-sdk 使用DEMO地址</a>


## 具体配置含义[⬆](#目录)<!-- Link generated with jump2header -->

### PLAN_ENUM（可选）[⬆](#目录)<!-- Link generated with jump2header -->

<ul>
    <li>执行计划枚举，在执行计划的时候通过选中方案进行执行。</li>
    <li>如果不支持Mutation方案，则自动降级为setTimeout。</li>
    <li>其中各方案带有节流，以便造成额外的性能开销。</li>
    <li>默认方案为SET_TIMEOUT</li>
</ul>

| 属性名            | 描述 |
| ---------------- | ----------- |
| SET_TIMEOUT          | 通过setTimout实现执行方案 |
| OB_SERVER         | 通过MutationObserver实现执行方案 |


### ACTION_ORDER（可选）[⬆](#目录)<!-- Link generated with jump2header -->

<ul>
    <li>设置当前web应用权限执行顺序逻辑</li>
    <li>默认执行顺序 ---> 当前不可拥有权限 ---> 当前必须拥有权限 ---> 当前特定权限</li>
</ul>

| 属性名            | 描述 |
| ---------------- | ----------- |
| doNoPermiss          | 不可拥有 权限 |
| doHavePermiss         | 可拥有 权限 |
| doSpecialPermiss         | 特殊权限 |


### permissionSimpleDTO（必选）[⬆](#目录)<!-- Link generated with jump2header -->

<ul>
    <li>设置当前web应用权限 havePermiss、noPermiss、specialPermiss 存储索引内容</li>
    <li>每个节点固定DTO描述</li>
</ul>

| 属性名            |是否必选| 描述 |
| ---------------- | ----------- | ----------- |
| routerPath        |必选| 当前路由关键字（react,vue,传统web应用), 也可以直接取"/"，表示所有路由匹配|
| eleIdOrClass      |必选| 当前节点的ID或则ClassName，若是ID，则赋值"#具体ID",若是className，则赋值".具体ClassName"，最终通过querySelector和querySelectorAll获取，建议使用ID |
| resultType        |可选| 默认hidden |
| showElemType     |可选|用户自定义display内容，设置后该节点将变为 display:用户内容!important;若赋值，则不会执行resultType逻辑|
|describe          |可选|节点描述，方便DEBUG查看具体含义，理论上为String类型最大值|
|callBackFunc      |可选|当前节点执行方法;默认不执行，若赋值，则只会执行当前callBackFunc(必须是一个function,箭头函数，class均会被throw)，目前提供具体的4个方法，见如下代码，<b>下个版本计划加入sandBox进行安全信任配置</b>|
|vueTemplateRoot   |可选|当前节点可使用的vue对象，默认为""。若当前节点为正确的vue template ID，则可以在callBackFunc下得到当前vue 的this,通过this调用，若失败或则为""，this则为window|

```js

    //callBackFunc示例
    callBackFunc = function(tools){
        tools.$queryAll('.router_main i').forEach(i =>{
            //你的业务逻辑   
        }
    })

    /*
        其中tools包含
        tools = {
            $getById(el){
                return document.getElementById(el)
            },
            $query(el){
                return document.querySelector(el)
            },
            $queryAll(el){
                return document.querySelectorAll(el)
            },
            $getTagName(el){
                return document.getElementsByTagName(el)
            }
        }

        若libraryName = 'vue' 且 节点vueTemplateRoot 指定为正确的vue template  ，则callBackfunc下的this为当前vue对象，可对当前vue对象做任何操作
    */

```



### webRabcPermissionSdkOptions（必选）[⬆](#目录)<!-- Link generated with jump2header -->

<ul>
    <li>实例构造的最基本DTO</li>
</ul>

| 属性名            |是否必选| 描述 |
| ---------------- | ----------- | ----------- |
| permission        |可选| 为微前端保留的实体结构|
| libraryName        |可选| 本次执行web应用中的基本框架，传入vue 或则 react，其中传入vue ，callBackFunc下获取library下对应的this对象有影响，不传入this默认指向window|
| plan        |必选| 执行方案，参见  PLAN_ENUM |
| havePermiss        |可选|  当前角色下必定显示的节点与路由集合(array)|
| noPermiss        |可选|  当前角色下 需要隐藏或则删除的节点与路由集合(array)|
| specialPermiss        |可选|  当前角色下 特殊的 节点与路由集合(array)|
| actionOrder        |可选|  havePermiss、noPermiss、specialPermiss执行顺序，默认当前不可拥有权限 ---> 当前必须拥有权限 ---> 当前特定权限|



## 启动权限[⬆](#目录)<!-- Link generated with jump2header -->
```js

    let _webRabc = new webRabcPermisson(webRabcPermissionSdkOptions);
      _webRabc.start({
        //PLAN_ENUM.SET_TIMEOUT 的轮询间隔，也可以充当 PLAN_ENUM.OB_SERVER 的节流时间
        millisec:500, 
        //PLAN_ENUM.OB_SERVER 的监控范围
        obServerConfig:{
                attributes:false,
                childList:true,
                subtree:true,
                characterData:false
            },
        //PLAN_ENUM.OB_SERVER 的节流间隔
        delay:500,
        //PLAN_ENUM.OB_SERVER 下具体监控节点
        obElem:'app'
        });

```

## 工程架构总览与执行简述[⬆](#目录)<!-- Link generated with jump2header -->
### 程序执行步骤简述
<ol>
    <li>面向切面的编程思想</li>
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

![SDK架构图](https://s1.ax1x.com/2022/11/23/z3WOmQ.png)


## 继续开发计划[⬆](#目录)<!-- Link generated with jump2header -->
<ol>
    <li>
        - [] 增加sandBox，可选
        <ol>
            <li>黑名单配置</li>
            <li>运行时验证</li>
            <li>start前验证</li>
        </ol>
    </li>
    <li>
       - [] 增加微前端模式
    </li>
    <li>
    - [] 可配置执行浏览器空闲执行
    </li>
    <li>
     - [] resultType增加removeNode逻辑实现
    </li>
</ol>

