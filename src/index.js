import {webRabcPermissionSdkOptions,permissionDTO,permissionSimpleDTO,
    PLAN_ENUM,ACTION_ORDER
} 
from './config/config';

import {setHavePermission,setNoPermission,setSpecialPermission,
    _requestAnimationFrame,_requestIdleCallback,_setTimeout,_MutationObserver,
    checkPlan,isBoolean,
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
    #args = void 0;
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
            //_MutationObserver.call(this,args)
            //console.log('this.#obServer callback')
            _MutationObserver(args)
        }
    };
    //必须是ID
    #obElem = 'app'
    #obServer = null;
    /*  
        降级方案  setTimeout
        默认    setTimeout 
        动作    requestAnimationFrame   requestIdleCallback   
    */
    //#plan = PLAN_ENUM.SET_TIMEOUT;
    #plan = PLAN_ENUM.SET_TIMEOUT;
    #planCheck = null;
    #version = '1.1.0';
    #running = false;
    //执行顺序
    #actionOrder = [];
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
    /*
        args:{
            millisec:int,
            obServerConfig:{
                attributes:boolean,
                childList:boolean,
                subtree:boolean,
                characterData:boolean
            },
            delay:int,
            obElem:#id(必须是ID)
        }
    */
    #startSDK(args){
        //保存最开始的参数
        this.#args = args;

        /*
            1   选择控制方式
            2   控制方式
        */
        let userChoosePlan = this.config.plan,
        millisec = this.#millisec,
        actionOrder = !!this.config.actionOrder.length ? this.config.actionOrder : Reflect.ownKeys(ACTION_ORDER),
        obElem = void 0;


        if(!!userChoosePlan && this.#planCheck[userChoosePlan]){
            this.#plan = userChoosePlan;
        }

        
        this.#actionOrder = actionOrder;
        this.config.actionOrder =  actionOrder;
        
        millisec = (args && args.millisec) ? args.millisec : millisec
        obElem = (args && args.obElem) ? args.obElem : this.#obElem;
        //MutationObserver参数配置
        if(args.obServerConfig){
            let _argsConfig = args.obServerConfig;
            this.#obServerConfig.config = {
                attributes:isBoolean(_argsConfig.attributes) ? _argsConfig.attributes : true,
                childList:isBoolean(_argsConfig.childList) ? _argsConfig.childList : true,
                subtree:isBoolean(_argsConfig.subtree) ? _argsConfig.subtree : true,
                characterData:isBoolean(_argsConfig.characterData) ? _argsConfig.characterData : false,
            }
        }

        switch(this.#plan){                       
          /*   case PLAN_ENUM.REQUEST_ANIMATION_FRAME:
                _requestAnimationFrame.call(this);
            break;
            case PLAN_ENUM.REQUEST_IDLE_CALLBACK:
                _requestIdleCallback.call(this)
            break; */
            case PLAN_ENUM.OB_SERVER:
               // console.log('this.#obServer begin:',!this.#obServer,this.#obServer)
                if(!this.#obServer){
                    //console.log('this.#obServer begin2:',!this.#obServer,this.#obServer)
                    this.#obServer = new MutationObserver(
                            this.#obServerConfig.func.bind(this,
                            {
                                permissionDiffResult:this.#permissionDiffResult,
                                millisec:millisec,
                                delay:args.delay ? args.delay : this.#millisec,
                                permissionCache:this.#permissionCache,
                                actionOrder: this.#actionOrder
                            })
                        )
                    //console.log('this.#obServer begin3:',!this.#obServer,this.#obServer)
                }
                
                //console.log('document.getElementById(obElem):',document.getElementById(obElem))
                this.#obServer.observe(document.getElementById(obElem),this.#obServerConfig.config);
                //console.log('takeRecords:',this.#obServer.takeRecords()  )
                //console.log('this.#obServer end:',this.#obServer)
            break;
            case PLAN_ENUM.SET_TIMEOUT:     
                this.timer = _setTimeout.call(this,this.#permissionDiffResult,millisec,this.#permissionCache,this.#actionOrder)
            break;
            default:
                this.timer = _setTimeout.call(this,this.#permissionDiffResult,millisec,this.#permissionCache,this.#actionOrder)
            break;
        }
    }
    start(args){
        this.#running = true;
        this.#permissionDiffResult = diffPermissNode(this.#permissionCache,this.config);
        try{
        this.#startSDK(args);

        }catch(err){
            console.error('err:',err)
        }
        return this;
    }
    //可能传新的参数 会覆盖之前的参数
    reload(args = void 0){
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

const getNewPermissionSimpleDTO = function(){
    const obj = JSON.parse(JSON.stringify(permissionSimpleDTO))
    return obj;
}


export {
    webRabcPermisson,webRabcPermissionSdkOptions,getNewPermissionDTO,getNewPermissionSimpleDTO,PLAN_ENUM,ACTION_ORDER
}