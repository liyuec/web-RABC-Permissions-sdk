const webRabcPermissionSdkOptions = {
    permission:{
        //  permission 得到的方法，传入一个function
        Func:undefined,
        isRemote:false,
        Refresh:0,
        //默认无框架(***************预留***************)
        libraryName:'',
        //微前端(***************预留***************)
        microLibraryName:undefined
    },
    //不做任何处理的节点
    havePermiss:[],
    //需要diplay:none 或则 删除 或则 执行用户callBack 的节点
    noPermiss:[],
    //特殊的节点   需要diplay:none 或则 删除 或则 执行用户callBack 的节点
    specialPermiss:[]
}


const PLAN_ENUM = {
    'REQUEST_ANIMATION_FRAME':'requestAnimationFrame',
    'REQUEST_IDLE_CALLBACK':'requestIdleCallback',
    'SET_TIMEOUT':'setTimeout'
}

const permissionDTO = {
    //当前路由名称
    routerName:'',
    //控制节点的ID或则ClassName
    eleIdOrClass:'',
    //下级内容
    childs:[],
    //hidden | removeNode | callback
    resultType:''
}


const permissionSimpleDTO = {
    //符合当前routerName均执行    *表示所有情况下均执行
    routerName:'',
    //控制节点的ID或则ClassName
    eleIdOrClass:'',
    //hidden | removeNode | callback
    resultType:'',
    //节点描述，方便DEBUG
    describe:'',
    //节点callback
    callBackFunc:undefined
}


export {
    webRabcPermissionSdkOptions,permissionDTO,permissionSimpleDTO,PLAN_ENUM
}