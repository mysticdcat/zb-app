export default {
    setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
}






// setupWebViewJavascriptBridge(function (bridge) {
//     var uniqueId = 1
//     function log(message, data) {
//         var log = document.getElementById('log')
//         var el = document.createElement('div')
//         el.className = 'logLine'
//         el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
//         if (log.children.length) { log.insertBefore(el, log.children[0]) }
//         else { log.appendChild(el) }
//     }

//     //客户端调用js
//     bridge.registerHandler('testJavascriptHandler', function (data, responseCallback) {
//         log('ObjC called testJavascriptHandler with', data)
//         var responseData = { 'Javascript Says': 'Right back atcha!' }
//         log('JS responding with', responseData)
//         responseCallback(responseData)
//     })

//     //picker
//     var tempFilePaths
//     var pickerImage = document.getElementById('pickerImage')
//     pickerImage.onclick = function (e) {
//         log('pickerImage...')

//         //js调用客户端
//         bridge.callHandler('pickerImage', { 'maxCount': '9' }, function (response) {
//             log('pickerImage response', response)
//             tempFilePaths = response.tempFilePaths
//             var image = document.getElementById('myImg')
//             image.src = tempFilePaths[0]
//         })
//     }

//     var previewImage = document.getElementById('previewImage')
//     previewImage.onclick = function (e) {
//         log('previewImage...')
//         bridge.callHandler('previewImage', { 'urls': tempFilePaths, 'currentIndex': '0' }, null)
//     }

//     bridge.registerHandler('alertHandler', function (data, responseCallback) {
//         log('ObjC called testJavascriptHandler with', data)
//         var responseData = { 'Javascript Says': 'Right back atcha!' }
//         log('JS responding with', responseData)
//         responseCallback(responseData)
//     })
// })