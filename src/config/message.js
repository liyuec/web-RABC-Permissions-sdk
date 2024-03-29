const MESSAGE = {
    'HAVE_PERMISS_MUST_ARRAY':'have permission 必须为一个数组',
    'NO_PERMISS_MUST_ARRAY':'no permission 必须为一个数组',
    'SPECAIL_PERMISS_MUST_ARRAY':'specail permission 必须为一个数组',
    'MUST_NO_RUNNING':'设置权限数据 或 权限执行方案 需要stop 后 再设置，避免多次diff对比，请记得reload',
    'MUST_FUNCTION':'必須是一個function，而非箭头函数'
}


function _getConsole(type){
    switch(type){
        case 'log':
            return function(msg){
                console.log(msg)
            }
        break;
        case 'warn':
            return function(msg){
                console.warn(msg)
            }
        break;
        case 'error':
            return function(msg){
                console.error(msg)
            }
        break;
    }
}

const conWar = _getConsole('warn')
const conErr = _getConsole('error')
const conLog = _getConsole('log')


export {MESSAGE,conWar,conErr,conLog}