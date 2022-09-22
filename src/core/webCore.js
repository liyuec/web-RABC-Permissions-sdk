import {PLAN_ENUM} from '../config/config'
import {MESSAGE,conWar,conErr,conLog} from '../config/message'

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
function diffPermissNode(permissionCache,config){
    _checkPermissionDataType(config)
    let {havePermiss,noPermiss} = permissionCache,
    _diffResult ={
        havePermiss:{},
        noPermiss:{}
    },
    //去重后的结果array
    _havePermiss = {},_noPermiss = {}

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
                if(hItem.routerPath === noPermiss[i].routerPath && hItem.eleIdOrClass === noPermiss[i].eleIdOrClass){
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

    _diffResult = {
        havePermiss:_havePermiss,
        noPermiss:_noPermiss
    }

    return _diffResult;
}

//根据当前路由path得到 当前需要处理的权限节点数组
function getWhoRouter(permissionDiffResult){
    let haveElems = [],noPerElems = [],
    {havePermiss,noPermiss} = permissionDiffResult,
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

    return {
        haveElems:haveElems,
        noPerElems:noPerElems
    }
}

function doNoPermissDOM(noPermiss){
    noPermiss.forEach(ele =>{
        if(ele.eleIdOrClass.startsWith('#')){
            let elem = document.querySelector(ele.eleIdOrClass);
            if(elem){
                if(elem.style.display != 'none'){
                    elem.style.display = 'none'
                }
            }
        }else if(ele.eleIdOrClass.startsWith('.')){
            let elemList =  document.querySelectorAll(ele.eleIdOrClass);
            elemList.forEach(elem =>{
                if(elem.style.display != 'none'){
                    elem.style.display = 'none'
                }
            })
        }
    })
}

function doHavePermissDOM(havePermiss){
    havePermiss.forEach(ele => {
        if(ele.eleIdOrClass.startsWith('#')){
            let elem = document.querySelector(ele.eleIdOrClass);
            if(elem){
                if(!!ele.showElemType){
                    elem.style.setProperty('display',ele.showElemType,'important');
                }else{
                    if(elem.style.display == 'none'){
                        elem.style.display = ''
                    }
                }
            }
        }else if(ele.eleIdOrClass.startsWith('.')){
            let elemList =  document.querySelectorAll(ele.eleIdOrClass);
            elemList.forEach(elem =>{
                if(elem.style.display == 'none'){
                    elem.style.display = ''
                }
            })
        }
    })
}

function _requestAnimationFrame(){

}

function _requestIdleCallback(){

}

function _setTimeout(permissionDiffResult,millisec){
    let _this = this,
    {haveElems,noPerElems} = getWhoRouter(permissionDiffResult)
    _this.timer = setTimeout(() => {
        doNoPermissDOM(noPerElems);
        doHavePermissDOM(haveElems);
        _setTimeout.call(_this,permissionDiffResult,millisec)
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
        [PLAN_ENUM.REQUEST_ANIMATION_FRAME]:false,
        [PLAN_ENUM.REQUEST_IDLE_CALLBACK]:false
    }

    checkResult[PLAN_ENUM.REQUEST_ANIMATION_FRAME] = fn(PLAN_ENUM.REQUEST_ANIMATION_FRAME)
    checkResult[PLAN_ENUM.REQUEST_IDLE_CALLBACK] = fn(PLAN_ENUM.REQUEST_IDLE_CALLBACK)

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


function destroy(){

}

function start(){

}

function reload(){

}

function setData(){
    
}

function stop(){
    
}

export {
    setHavePermission,setNoPermission,setSpecialPermission,checkPlan,
    _requestAnimationFrame,_requestIdleCallback,_setTimeout,
    diffPermissNode
}