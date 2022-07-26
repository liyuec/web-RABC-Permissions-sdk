import {webRabcPermissionSdkOptions,permissionDTO,permissionSimpleDTO,
    PLAN_ENUM
} 
from './config/config';

import {setHavePermission,setNoPermission,setSpecialPermission,
    _requestAnimationFrame,_requestIdleCallback,_setTimeout,
    checkPlan,
    diffPermissNode
} from './core/webCore';

class webRabcPermissionSdk{
    #permissionCache;
    //最初的记录 new 的时候传递进来的
    config;
    #permissionDiffResult = [];
    //如过有timer， 记得timer的ID
    #timer = 0;
    /*  
        降级方案  requestAnimationFrame   requestIdleCallback   setTimeout
        默认    setTimeout 
    */
    #plan = PLAN_ENUM.SET_TIMEOUT;
    #version = '1.0.0'
    constructor(options = null){
        if(options){
            this.config = options;
        }
        this.#plan = checkPlan();
        this.#startSDK();
    }

    setPermissData(data){
        if(data.havePermiss){
            setHavePermission.call(this,data.havePermiss);
        }
        if(data.noPermiss){
            setNoPermission.call(this,data.noPermiss);
        }
        if(data.specialPermiss){
            setSpecialPermission.call(this,data.specialPermiss);
        }

        return this;
    }

    #startSDK(){
        diffPermissNode.call(this);
        switch(this.#plan){
            case PLAN_ENUM.REQUEST_ANIMATION_FRAME:
                _requestAnimationFrame.call(this);
            break;
            case PLAN_ENUM.REQUEST_IDLE_CALLBACK:
                _requestIdleCallback.call(this)
            break;
            case PLAN_ENUM.SET_TIMEOUT:     
                _setTimeout.call(this)
            break;
        }
    }


    reload(){
        this.#startSDK();
        return this;
    }

    stop(){
        return this;
    }

    clear(){

    }

    set permissionCache(cache){
        this.#permissionCache = cache;
    }

    get permissionCache(){
        return this.#permissionCache;
    }

    getSdkInfo(stringify = false){
        let result = {
            version:this.#version,
            plan:this.#plan,
            config:this.config,
            diffResult:this.permissionDiffResult,
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
    let _instance,
    _defaultOptions = webRabcPermissionSdkOptions;
    return function(options){
        debugger;
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
    webRabcPermisson,webRabcPermissionSdkOptions,getNewPermissionDTO,getNewPermissionSimpleDTP
}