export function MP() {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve()
        };
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//webapi.amap.com/maps?v=1.4.8&key=2d54455848ff4c6d31403735897341da" + "&callback=init";
        script.onerror = reject;
        document.head.appendChild(script);
    })
}