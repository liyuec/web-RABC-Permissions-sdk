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
function diffPermissNode(permissionCache){
    _checkPermissionDataType(this.config)
    let {havePermiss,noPermiss} = permissionCache,
    _diffResult ={
        havePermiss:{},
        noPermiss:{}
    },
    //去重后的结果array
    _havePermiss = {},_noPermiss = {}
    
    //无序数组  去重 + 组合对象
    if(havePermiss.length > 0 && noPermiss.length > 0){
        havePermiss.forEach(hItem => {
            let isSame = false;
            for(let i = 0;i<noPermiss.length;i++){
                if(hItem.routerName === noPermiss[i].routerName && hItem.eleIdOrClass === noPermiss[i].eleIdOrClass){
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
                _havePermiss[hItem.routerName] = _havePermiss[hItem.routerName] ? _havePermiss[hItem.routerName].push(hItem) : [hItem]
            }
        })
        _noPermiss = noPermiss.reduce((obj,item)=>{
            if(!item.isSame){
                obj[item.routerName] = obj[item.routerName] ? obj[item.routerName].push(item) : [item]
            }
            return obj;
        },{})
    }else{
        if(havePermiss.length > 0){
            _havePermiss = havePermiss.reduce((obj,item)=>{
                obj[item.routerName] = obj[item.routerName] ? obj[item.routerName].push(item) : [item]
                return obj;
            },{})
        }
        if(noPermiss.length > 0){
            _noPermiss = noPermiss.reduce((obj,item)=>{
                obj[item.routerName] = obj[item.routerName] ? obj[item.routerName].push(item) : [item]
                return obj;
            },{})
        }   
        
    }

    _diffResult = {
        havePermiss:_havePermiss,
        noPermiss:_noPermiss
    }

    return _diffResult;
}

function getWhoRouter(){

}

function _requestAnimationFrame(){

}

function _requestIdleCallback(){

}

function _setTimeout(){
    setTimeout(() => {
        
    }, 500);
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

    return checkResults;
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