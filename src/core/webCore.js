import {PLAN_ENUM,ACTION_ORDER} from '../config/config'
import {MESSAGE,conWar,conErr,conLog} from '../config/message'

const _toString = typeof Reflect !== undefined ? Reflect.toString : Object.toString;

function setHavePermission(havePermiss){
    this.config.havePermiss = [...havePermiss];
}

function setNoPermission(noPermiss){
    this.config.noPermiss = [...noPermiss]
}

function setSpecialPermission(specialPermiss){
    this.config.specialPermiss = [...noPermiss]
}

//have permisson 和 No permission 的会冲突，diff掉 no里的permisson
//specialPermiss 不做任何计算
function diffPermissNode(permissionCache,config){
    _checkPermissionDataType(config)
    let {havePermiss,noPermiss,specialPermiss} = permissionCache,
    _diffResult ={
        havePermiss:{},
        noPermiss:{},
        specialPermiss:{}
    },
    //去重后的结果array
    _havePermiss = {},_noPermiss = {},
    _specialPermiss = {}

    let getGroup = (function(){
        return function(groups,cb){
            return groups.reduce((obj,item)=>{
				if(cb ? cb.call(item,obj) : true){
					obj[item.routerPath] ? obj[item.routerPath].push(item) : obj[item.routerPath] = [item]
					return obj;
				}
				return obj;
				
            },{})
        }
    })()
    
    //无序数组  去重 + 组合对象
    if(havePermiss.length > 0 && noPermiss.length > 0){
        havePermiss.forEach(hItem => {
            let isSame = false;
            for(let i = 0;i<noPermiss.length;i++){
                //bug 多余条 则可能出现过滤失败的情况；
                /*
                    一个人，对按钮A控制
                    1.A 可以
                    2.A 可以
                    3.A 不可以
                    4.A 不可以
                */
                if(hItem.routerPath === noPermiss[i].routerPath && hItem.eleIdOrClass === noPermiss[i].eleIdOrClass && !noPermiss[i].isSame){
                    isSame = true;
                    noPermiss[i].isSame = true;
                    break;
                }else{
                    if(!noPermiss[i].isSame){
                        noPermiss[i].isSame = false;
                    }
                }
            }
            if(!isSame){
                //_havePermiss[hItem.routerPath] = _havePermiss[hItem.routerPath] ? _havePermiss[hItem.routerPath].push(hItem) : [hItem]
                _havePermiss[hItem.routerPath] ? _havePermiss[hItem.routerPath].push(hItem) : _havePermiss[hItem.routerPath]  = [hItem]
            }
        })
      /*   _noPermiss = noPermiss.reduce((obj,item)=>{
            if(!item.isSame){
                obj[item.routerPath] = obj[item.routerPath] ? obj[item.routerPath].push(item) : [item]
            }
            return obj;
        },{}) */
        _noPermiss = getGroup(noPermiss,function(obj){
            if(this.isSame){
                return false;
            }
            return true;
        })
    }else{
        if(havePermiss.length > 0){
         /*    _havePermiss = havePermiss.reduce((obj,item)=>{
                obj[item.routerPath] = obj[item.routerPath] ? obj[item.routerPath].push(item) : [item]
                return obj;
            },{}) */
            _havePermiss = getGroup(havePermiss)
        }
        if(noPermiss.length > 0){
            _noPermiss = getGroup(noPermiss)
          /*   _noPermiss = noPermiss.reduce((obj,item)=>{
                obj[item.routerPath] = obj[item.routerPath] ? obj[item.routerPath].push(item) : [item]
                return obj;
            },{}) */
        }   
        
    }

    //specialPermiss单独计算,全部作用
    if(specialPermiss.length > 0){
        _specialPermiss =  getGroup(specialPermiss)
    }

    _diffResult = {
        havePermiss:_havePermiss,
        noPermiss:_noPermiss,
        specialPermiss:_specialPermiss
    }

    return _diffResult;
}

//根据当前路由path得到 当前需要处理的权限节点数组
function getWhoRouter(permissionDiffResult){
    let haveElems = [],noPerElems = [],specialElems = [],
    {havePermiss,noPermiss,specialPermiss} = permissionDiffResult,
    _href = window.location.href;

    Object.keys(noPermiss).forEach(routerPath=>{
        if(_href.indexOf(routerPath) > -1){
            noPerElems.push(...noPermiss[routerPath])
        }
    })

    Object.keys(havePermiss).forEach(routerPath=>{
        if(_href.indexOf(routerPath) > -1){
            haveElems.push(...havePermiss[routerPath])
        }
    })

    Object.keys(specialPermiss).forEach(routerPath=>{
        if(_href.indexOf(routerPath) > -1){
            specialElems.push(...specialPermiss[routerPath])
        }
    })

    return {
        haveElems:haveElems,
        noPerElems:noPerElems,
        specialElems:specialElems
    }
}

function doNoPermissDOM(noPermiss,permissionCache){
    noPermiss.forEach(_ele =>{
         //如果有  则忽视节点可能没有的问题；单独执行callbackFunc
        if(!!_ele.callBackFunc){
            //callBackFunc节点
            _elemCallBackFunc(_ele,permissionCache)
            return;
        }
        if(_ele.eleIdOrClass.startsWith('#')){
            let elem = document.querySelector(_ele.eleIdOrClass);
            if(elem){
                if(!!_ele.showElemType){
                    elem.style.setProperty('display',_ele.showElemType,'important');
                }else{
                    if(elem.style.display != 'none'){
                        elem.style.display = 'none'
                    }
                }
            }
        }else if(_ele.eleIdOrClass.startsWith('.')){
            let elemList =  document.querySelectorAll(_ele.eleIdOrClass);
            elemList.forEach(elem =>{
                if(!!_ele.showElemType){
                    elem.style.setProperty('display',_ele.showElemType,'important');
                }else{
                    if(elem.style.display != 'none'){
                        elem.style.display = 'none'
                    }
                }
            })
        }
    })
}

function doHavePermissDOM(havePermiss,permissionCache){
    havePermiss.forEach(_ele => {
         //如果有  则忽视节点可能没有的问题；单独执行callbackFunc
        if(!!_ele.callBackFunc){
            //callBackFunc节点
            _elemCallBackFunc(_ele,permissionCache)
            return;
        }
        if(_ele.eleIdOrClass.startsWith('#')){
            let elem = document.querySelector(_ele.eleIdOrClass);
            if(elem){
                if(!!_ele.showElemType){
                    elem.style.setProperty('display',_ele.showElemType,'important');
                }else{
                    if(elem.style.display == 'none'){
                        elem.style.display = ''
                    }
                }
            }
        }else if(_ele.eleIdOrClass.startsWith('.')){
            let elemList =  document.querySelectorAll(_ele.eleIdOrClass);
            elemList.forEach(elem =>{
                if(!!_ele.showElemType){
                    elem.style.setProperty('display',_ele.showElemType,'important');
                }else{
                    if(elem.style.display == 'none'){
                        elem.style.display = ''
                    }
                }
            })
        }
    })
}

/*
    special 必须配置 showElemType 否则没有效果
    要么配置 callBackFunc；
*/
function doSpecialPermissDOM(specialPermiss,permissionCache){
    specialPermiss.forEach(_ele=>{
            //如果有  则忽视节点可能没有的问题；单独执行callbackFunc
           if(!!_ele.callBackFunc){
               //callBackFunc节点
               _elemCallBackFunc(_ele,permissionCache)
               return;
           }
           if(_ele.eleIdOrClass.startsWith('#')){
               let elem = document.querySelector(_ele.eleIdOrClass);
               if(elem){
                   if(!!_ele.showElemType){
                       elem.style.setProperty('display',_ele.showElemType,'important');
                   }
               }
           }else if(_ele.eleIdOrClass.startsWith('.')){
               let elemList =  document.querySelectorAll(_ele.eleIdOrClass);
               elemList.forEach(elem =>{
                    if(!!_ele.showElemType){
                        elem.style.setProperty('display',_ele.showElemType,'important');
                    }
               })
           }
    })
}

/*
    配置上必须是#    若以.开头，也只取第0个索引
*/
function _elemCallBackFunc(elem,permissionCache){
  
    //let {libraryName:_libraryName} = permissionCache.permission,
    let {libraryName:_libraryName} = permissionCache,
    {vueTemplateRoot:_vueTemplateRoot,callBackFunc:_callBackFunc} = elem;

    if(!isFunction(_callBackFunc)){
        throw new Error(MESSAGE.MUST_FUNCTION)
        return;
    }

    let _spaThis = null,
    tools = void 0,
    vueElem = null;
    if(_libraryName === 'vue'){
        vueElem = document.querySelector(_vueTemplateRoot);
        
        //if(Reflect.toString.call(vueElem).slice(8,-1) === 'HTMLDivElement'){
        if(_toString.call(vueElem).slice(8,-1) === 'HTMLDivElement'){   
            _spaThis = vueElem.__vue__;
        }
    }

    if(!_spaThis){
        _spaThis = window;
    }

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
    
    //不考虑class写法
    _callBackFunc.apply(_spaThis,[tools]);
    //释放
    tools = null;
    vueElem = null;
    _spaThis = null;
}

function _requestAnimationFrame(){

}

function _requestIdleCallback(){

}


const _MutationObserver = MutationObserverFunc()

/*
    args:
        permissionDiffResult,millisec
*/
function MutationObserverFunc(){
    let _millisec = 0,
    haveElems = void 0,
    noPerElems = void 0,
    specialElems = void 0,
    _actionOrder = [],
    beginTime = new Date().getTime(),
    _timeOut = null;
    //console.log('--------------MutationObserverFunc --------------')
    return function _mutFunc(args){
        _millisec = args.millisec;
        //执行顺序
        _actionOrder = args.actionOrder;
        //console.log('--------------MutationObserverFunc begin--------------')
        let now = new Date().getTime(),
        _delay = args.delay > 0 ? args.delay : args.millisec,
        permissionCache = args.permissionCache;

        if(now - beginTime > _delay){
            //console.log('******************************DO MutationServer:******************************')
            beginTime = new Date().getTime();
            clearTimeout(_timeOut);
            _timeOut = null;
            //可能路由会变化，所以也需要及时取 + 更新；
            queueMicrotask(()=>{
                ({haveElems,noPerElems,specialElems} = getWhoRouter(args.permissionDiffResult));
                _actionOrder.forEach(action => {
                    switch(action){
                        case ACTION_ORDER.doNoPermiss:
                            doNoPermissDOM(noPerElems,permissionCache);
                        break;
                        case ACTION_ORDER.doHavePermiss:
                            doHavePermissDOM(haveElems,permissionCache);
                        break;
                        case ACTION_ORDER.doSpecialPermiss:
                            doSpecialPermissDOM(specialElems,permissionCache);
                        break;
                    }
                })
      
            })
        }else{
            if(_timeOut === null){
                _timeOut = setTimeout(() => {
                    _mutFunc(args)
                }, _delay);
            }
        }
    }
}



function _setTimeout(permissionDiffResult,millisec,permissionCache,actionOrder){
    let _this = this,
    _actionOrder = [],
    {haveElems,noPerElems,specialElems} = getWhoRouter(permissionDiffResult);

    //执行顺序
    _actionOrder = actionOrder;

    _this.timer = setTimeout(() => {
        _actionOrder.forEach(action => {
            switch(action){
                case ACTION_ORDER.doNoPermiss:
                    doNoPermissDOM(noPerElems,permissionCache);
                break;
                case ACTION_ORDER.doHavePermiss:
                    doHavePermissDOM(haveElems,permissionCache);
                break;
                case ACTION_ORDER.doSpecialPermiss:
                    doSpecialPermissDOM(specialElems,permissionCache);
                break;
            }
        })
        _setTimeout.call(_this,permissionDiffResult,millisec,permissionCache,_actionOrder);
    }, millisec);
}   


//看下方案是否能用
function checkPlan(){
    let fn = function(PLAN){
        return new Function('',`return typeof ${PLAN}`)() != ((void 0) + '')
    }

    //默认 setTimout
    let checkResult = {
        [PLAN_ENUM.SET_TIMEOUT]:true,
      /*   [PLAN_ENUM.REQUEST_ANIMATION_FRAME]:false,
        [PLAN_ENUM.REQUEST_IDLE_CALLBACK]:false */
        [PLAN_ENUM.OB_SERVER]:false
    }

    checkResult[PLAN_ENUM.OB_SERVER] = fn(PLAN_ENUM.OB_SERVER)

    return checkResult;
}

/*
    判断关键数据的类型 
*/
function _checkPermissionDataType(data){
    if(data.havePermiss.constructor !== Array){
        conErr(MESSAGE.HAVE_PERMISS_MUST_ARRAY)
        return;
    }
    if(data.noPermiss.constructor !== Array){
        conErr(MESSAGE.NO_PERMISS_MUST_ARRAY)
        return;
    }
    if(data.specialPermiss.constructor !== Array){
        conErr(MESSAGE.SPECAIL_PERMISS_MUST_ARRAY)
        return;
    }
}

function getType(val){
    //return Reflect.toString.call(val).slice(8,-1)
    return _toString.call(val).slice(8,-1)
}

function isBoolean(val){
    if(_notNullAndUnde(val)){
        return getType(val) === 'Boolean'
    }
    return false;
}

//必须是function 不能是箭头函数
function isFunction(val){
    if(getType(val) === 'Function'){
        if(val.prototype === void 0){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}

function _notNullAndUnde(val){
    return (val !== null && val !== void 0)
}




export {
    setHavePermission,setNoPermission,setSpecialPermission,checkPlan,
    _requestAnimationFrame,_requestIdleCallback,_MutationObserver,_setTimeout,
    diffPermissNode,isBoolean
}