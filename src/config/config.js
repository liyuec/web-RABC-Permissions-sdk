const webRabcPermissionSdkOptions = {
    //线上debug 返回数据
    debugStr:'',
    permission:{
        //  permission 得到的方法，传入一个function
        Func:undefined,
        isRemote:false,
        Refresh:0,
        //默认无框架(***************预留***************)
        libraryName:undefined,
        //微前端(***************预留***************)
        microLibraryName:undefined
    },
    //方案  requestAnimationFrame   requestIdleCallback   setTimeout
    plan:'',
    //不做任何处理的节点
    havePermiss:[],
    //需要diplay:none 或则 删除 或则 执行用户callBack 的节点
    noPermiss:[],
    //特殊的节点   需要diplay:none 或则 删除 或则 执行用户callBack 的节点
    specialPermiss:[]
}


const PLAN_ENUM = {
    /* 'REQUEST_ANIMATION_FRAME':'requestAnimationFrame',
    'REQUEST_IDLE_CALLBACK':'requestIdleCallback', */
    'SET_TIMEOUT':'setTimeout',
    'OB_SERVER':'MutationObserver'
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
    //hidden | removeNode | callback | 
    resultType:'',
    //inline | inline-block | block | flex 等CSS节点
    showElemType:'',
    //节点描述，方便DEBUG
    describe:'',
    //节点callback
    callBackFunc:undefined
}


export {
    webRabcPermissionSdkOptions,permissionDTO,permissionSimpleDTO,PLAN_ENUM
}