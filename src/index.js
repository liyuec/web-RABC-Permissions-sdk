import {webRabcPermissionSdkOptions,permissionDTO} from './config/config';

import {setHavePermission,setNoPermission,setSpecialPermission} from './core/webCore';

class webRabcPermissionSdk{
    #permissionCache;
    #config;
    //如过有timer， 记得timer的ID
    #timer = 0;
    //降级方案  requestAnimationFrame   requestIdleCallback setTimeout
    #plan;
    #version = '1.0.0'
    constructor(options = null){
        if(options){
            this.#config = options;
        }else{
            
        }
    }

    /*
    
    */
    setPermissData(data){
        if(data.havePermiss)
            setHavePermission.call(this,data.havePermiss);


    }

    reload(){

    }

    stop(){

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
            config:this.#config
        }
        if(stringify){
            return JSON.stringify(result)
        }
        return result
    }

}



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


export {
    webRabcPermisson,webRabcPermissionSdkOptions,getNewPermissionDTO
}