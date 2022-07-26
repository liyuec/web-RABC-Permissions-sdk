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
function diffPermissNode(){
    _checkPermissionDataType(this.config)
    
}

function _requestAnimationFrame(){

}

function _requestIdleCallback(){

}

function _setTimeout(){

}


function checkPlan(){
    let fn = function(PLAN){
        return new Function('',`return typeof ${PLAN}`)() != ((void 0) + '')
    }

    //默认 setTimout
    let checkResult = PLAN_ENUM.SET_TIMEOUT;

    if(fn(PLAN_ENUM.REQUEST_ANIMATION_FRAME)){
        checkResult = PLAN_ENUM.REQUEST_ANIMATION_FRAME
    }else if(fn(PLAN_ENUM.REQUEST_IDLE_CALLBACK)){
        checkResult = PLAN_ENUM.REQUEST_IDLE_CALLBACK
    }

    //this.#plan = checkResults
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