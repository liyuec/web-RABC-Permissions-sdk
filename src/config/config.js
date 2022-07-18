const webRabcPermissionSdkOptions = {
    permission:{
        //  permission 得到的方法，传入一个function
        Func:undefined,
        isRemote:false,
        Refresh:0,
        //默认无框架
        libraryName:'' 
    },
    //不做任何处理的节点
    havePermiss:[],
    //需要diplay:none或则  删除的节点
    noPermiss:[],
    //特殊的节点
    specialPermiss:[]
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


export {
    webRabcPermissionSdkOptions,permissionDTO
}