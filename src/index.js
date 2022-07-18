import webRabcPermissionSdkOptions from './config/config'
class webRabcPermissionSdk{
    #config;
    //如过有timer， 记得timer的ID
    #timer = 0;
    //降级方案  requestAnimationFrame   requestIdleCallback setTimeout
    #plan;
    constructor(options = null){
        if(options){
            this.#config = options;
        }else{

        }
    }

    stop(){

    }

    clear(){

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


export {
    webRabcPermisson
}