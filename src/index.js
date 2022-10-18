import {webRabcPermissionSdkOptions,permissionDTO,permissionSimpleDTO,
    PLAN_ENUM
} 
from './config/config';

import {setHavePermission,setNoPermission,setSpecialPermission,
    _requestAnimationFrame,_requestIdleCallback,_setTimeout,_MutationObserver,
    checkPlan,
    diffPermissNode
} from './core/webCore';


import {conWar,MESSAGE} from './config/message';

class webRabcPermissionSdk{
    #permissionCache;
    //最初的记录 new 的时候传递进来的
    config;
    #permissionDiffResult = {
        havePermiss:{},
        noPermiss:{}
    };
    //如过有timer， 记得timer的ID
    timer = 0;
    #args = undefined;
    //setTimeout间隔
    #millisec = 500;
    //MutationObserver
    #obServerConfig = {
        config:{
            attributes:true,
            childList:true,
            subtree:true,
            characterData:false
        },
        func:function(args,mutationList,observer){
            _MutationObserver.call(this,args)
        }
    };
    //必须是ID
    #obElem = 'app'
    #obServer = undefined;
    /*  
        降级方案  requestAnimationFrame   requestIdleCallback   setTimeout
        默认    setTimeout 
    */
    //#plan = PLAN_ENUM.SET_TIMEOUT;
    #plan = PLAN_ENUM.SET_TIMEOUT;
    #planCheck = null;
    #version = '1.0.0';
    #running = false;
    constructor(options = null){
        if(options){
            this.config = options;
            //************  这里应该进行深拷贝 ********** */
            this.#permissionCache = options;
        }
        this.#planCheck = checkPlan();
    }
    setPlan(planType){
        if(this.#running){
            conWar(MESSAGE.MUST_NO_RUNNING)
            return this;
        }
        this.#plan = planType;
        return this;
    }
    setHavePermissData(data){
        if(this.#running){
            conWar(MESSAGE.MUST_NO_RUNNING)
            return this;
        }
        setHavePermission.call(this,data);
        return this;
    }
    setNoPermissData(data){
        if(this.#running){
            conWar(MESSAGE.MUST_NO_RUNNING)
            return this;
        }
        setNoPermission.call(this,data);
        return this;
    }
    setSpecialPermissData(data){
        if(this.#running){
            conWar(MESSAGE.MUST_NO_RUNNING)
            return this;
        }
        setSpecialPermission.call(this,data);
        return this;
    }
    #startSDK(args){
        //保存最开始的参数
        this.#args = args;

        //选择控制方式
        let userChoosePlan = this.config.plan,
        millisec = this.#millisec,
        obElem = this.#obElem;

        if(!!userChoosePlan && this.#planCheck[userChoosePlan]){
            this.#plan = userChoosePlan;
        }
        
        millisec = (args && args.millisec) || millisec


        switch(this.#plan){                       
          /*   case PLAN_ENUM.REQUEST_ANIMATION_FRAME:
                _requestAnimationFrame.call(this);
            break;
            case PLAN_ENUM.REQUEST_IDLE_CALLBACK:
                _requestIdleCallback.call(this)
            break; */
            case PLAN_ENUM.OB_SERVER:
                if(this.#obServer){
                    this.#obServer = new MutationObserver(this.obServerConfig.func.bind(this,
                        {
                            millisec:millisec
                        }))
                }
                this.#obServer.obServer(document.getElementById(obElem),this.obServerConfig.config);
            break;
            case PLAN_ENUM.SET_TIMEOUT:     
                this.timer = _setTimeout.call(this,this.#permissionDiffResult,millisec)
            break;
            default:
                this.timer = _setTimeout.call(this,this.#permissionDiffResult,millisec)
            break;
        }
    }
    start(args){
        this.#running = true;
        this.#permissionDiffResult = diffPermissNode(this.#permissionCache,this.config);
        this.#startSDK(args);
        return this;
    }
    //可能传新的参数 会覆盖之前的参数
    reload(args = undefined){
        this.#running = true;
        this.start(args ? args : this.#args);
        return this;
    }

    stop(){
        this.#running = false;
        switch(this.#plan){
            case PLAN_ENUM.SET_TIMEOUT:     
                clearTimeout(this.timer);
            break;
            case PLAN_ENUM.OB_SERVER:
                this.#obServer.disconnect();
            break;
        }
      
        return this;
    }

    clear(){

    }

    get permissionCache(){
        return this.#permissionCache;
    }

    getSdkInfo(stringify = false){
        let result = {
            version:this.#version,
            plan:this.#plan,
            checkPlan:this.#planCheck,
            config:this.config,
            diffResult:this.#permissionDiffResult,
            cachePermission:this.#permissionCache
        }
        if(stringify){
            return JSON.stringify(result)
        }
        return result
    }

}



//sdk 入口  单例
const webRabcPermisson = (function(){
    let _instance = null,
    _defaultOptions = webRabcPermissionSdkOptions;
    return function(options){
        if(!_instance){
            _defaultOptions = Object.assign(_defaultOptions,options);
            _instance = new webRabcPermissionSdk(_defaultOptions)
             return _instance;
        } 
        
        return _instance;
    }
})()

const getNewPermissionDTO = function(){
    const obj = JSON.parse(JSON.stringify(permissionDTO))
    return obj;
}

const getNewPermissionSimpleDTP = function(){
    const obj = JSON.parse(JSON.stringify(permissionSimpleDTO))
    return obj;
}


export {
    webRabcPermisson,webRabcPermissionSdkOptions,getNewPermissionDTO,getNewPermissionSimpleDTP,PLAN_ENUM
}