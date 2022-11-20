const webRabcPermissionSdkOptions = {
    //线上debug 返回数据
    debugStr:'',
    permission:{
        //  permission 得到的方法，传入一个function
        Func:void 0,
        isRemote:false,
        Refresh:0,
        //微前端(***************预留***************)
        microLibraryName:void 0
    },
    //只支持获取vue的this   vue | react  非微前端配置
    libraryName:'',
    //方案  MutationObserver  setTimeout
    plan:'',
    //不做任何处理的节点
    havePermiss:[],
    //需要diplay:none 或则 删除 或则 执行用户callBack 的节点
    noPermiss:[],
    //特殊的节点   需要diplay:none 或则 删除 或则 执行用户callBack 的节点
    specialPermiss:[],
    //执行顺序  默认 have->no->special
    actionOrder:[]
}


const PLAN_ENUM = {
    /* 'REQUEST_ANIMATION_FRAME':'requestAnimationFrame',
    'REQUEST_IDLE_CALLBACK':'requestIdleCallback', */
    'SET_TIMEOUT':'setTimeout',
    'OB_SERVER':'MutationObserver'
}


/*
    执行顺序枚举
*/
const ACTION_ORDER = {
    'doNoPermiss':'doNoPermiss',
    'doHavePermiss':'doHavePermiss',
    'doSpecialPermiss':'doSpecialPermiss'
}

const permissionDTO = {
    //当前路由名称
    routerPath:'',
    //控制节点的ID或则ClassName
    eleIdOrClass:'',
    //下级内容
    child:[],
    //hidden | removeNode | callback
    resultType:''
}


const permissionSimpleDTO = {
    //符合当前routerPath均执行    *表示所有情况下均执行
    routerPath:'',
    //控制节点的ID或则ClassName
    eleIdOrClass:'',
    //hidden | removeNode       ....暂未实现    默认hidden   考虑removeNode影响DOM，从而影响虚拟DOM，做测试后再实现
    resultType:'',
    //inline | inline-block | block | flex 等CSS节点
    showElemType:'',
    //节点描述，方便DEBUG
    describe:'',
    //节点callback
    callBackFunc:void 0,
    //vueTemplate的父节点 (当前.vue最佳)   #id  .class
    vueTemplateRoot:''
}


export {
    webRabcPermissionSdkOptions,permissionDTO,permissionSimpleDTO,PLAN_ENUM,ACTION_ORDER
}