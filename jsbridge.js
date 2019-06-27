const jsBridge = {

    //回调函数维护（包含js端注册的回调和callHandler的回调）
    callbackManager: {},

    //记录callHandler回调的id
    cbIndex: 0,



    /**
     * js调用native
     * 这里模拟时，android平台和ios平台都是用scheme策略调用原生方法
     *
     * @param {*} nativeFunctionName 原生方法名
     * @param {*} params 参数
     * @param {*} callback 回调
     */
    callHandler: function (nativeFunctionName, params, callback) {
        if(callback){
            //将callback注册到callbackManager，每次函数名为‘cb_i’ (递增)
            cbIndex++
            var callbackName = 'cb_' + this.cbIndex 
            
            this.registerCallback(callbackName)
        }

        //构造scheme，构造iframe，发送url
        var params=params.reduce(function(res,param){
            return res+'&'+param
        },'')
        var url = 'jscall://' + nativeFunctionName + params + '&' + callbackName; //此时将回调名传给了na，na执行完原生方法后，会调用_handleMessageFromNative方法，传入该回调名，执行回调，具体见下面
        var iframe=document.createEvent('iframe')
        iframe.setAttribute('width', 0);
        iframe.style.display = 'none';
        iframe.setAttribute('src', url);
        document.documentElement.appendChild(iframe);

        setTimeout(function () {
            iframe && document.documentElement.removeChild(iframe);
            iframe = null;
        }, 0);
    },

    
    /**
     * native调用js方法
     * 
     *
     * @param {*} jsFunctionName js方法名（注册到callbackManager里的key值）
     * @param {*} data native传来的数据
     */
    _handleMessageFromNative:function(jsFunctionName,data){
        var callback=this.callbackManager[jsFunctionName]
        callback(data)
    },
    

    /**
     * 注册callback到callbackManager，等待原生调用
     *
     * @param {*} callback
     */
    registerCallback:function(callback){
        this.callbackManager[callbackName] = callback
    }



}