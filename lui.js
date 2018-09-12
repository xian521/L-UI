/* 监听手机运行的操作系统以及版本, 区分 iOS, Android 并且获取版本 */
(function (window) {
    var ua = window.navigator.userAgent, name = "Other", version = [0];
    if (/Android|HTC/i.test(ua) || !!(window.navigator['platform'] + '').match(/Linux/i)) {
        name = 'Android';
        version = ua.slice(ua.indexOf("Android") + 8).split(";")[0].split(".");
    } else if (/iPad/i.test(ua) || /iPod|iPhone/i.test(ua)) {
        name = 'iOS';
        version = ua.toLowerCase().match(/cpu(.*?)os (.*?) like mac os/);
        version = version[version.length - 1].split("_");
    }
    window.PhoneSystem = {name: name, version: version};
})(window);

/* 获取 URL 传递的参数 */
(function (window) {
    var url = window.location.search.substring(1);
    var atr = url.split('&'), arr = null;
    window.UrlParm = {};
    for (var i = 0; i < atr.length; i++) {
        arr = atr[i].split("=");
        window.UrlParm[arr[0]] = decodeURIComponent(arr[1]);
    }
})(window);

/* 设置手机端布局宽度, 一般根据 UI 设计图来设置, 取值在 360 左右最佳 */
(function (window, document, width) {
    var content = "user-scalable=no,width=" + width;
    if (
        window.PhoneSystem.name == "Android"
        && window.parseInt(window.PhoneSystem.version[0]) <= 4
        && window.parseInt(window.PhoneSystem.version[1]) < 5
    ) {
        content += ",target-densitydpi=device-dpi";
    }
    content += ",initial-scale=" + window.screen.width / width;
    content += ",minimum-scale=" + window.screen.width / width;
    content += ",maximum-scale=" + window.screen.width / width;
    var meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", content);
    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(meta, document.getElementsByTagName("meta")[0]);
})(window, document, 360);

/**
 * 上拉加载对象
 * @param param，参数配置对象
 *     Jpm   : 主容器对象，即固定高度可以滚动的 jQuery 对象，默认：$(document)
 *     Jom   : 内容容器对象，伸缩高度的 jQuery 对象, 默认：$("body")
 *     rate  : 灵敏度，页面滑动到距离底部多少触发回调，默认：15
 *     height: Jpm 所代表的 Dom 对象的高度，默认：屏幕高度
 * @param cb，回调函数, 参数携带上拉加载对象
 * @function，setScroll(isScroll) 当 isScroll 为true时，禁用上拉加载
 */
function UpperLoading(param, cb) {
    if (typeof param != "object") console.error("UpperLoading 初始化参数错误");
    param.jpm = param.jpm || $(document);
    param.jom = param.jom || $("body");
    param.height = param.height || window.innerHeight;
    param.rate = param.rate || 15;
    cb = cb || function () {};
    var isScroll = true;
    param.jpm.bind("scroll", function (ev) {
        if (isScroll) return;
        var scroll = param.jpm.scrollTop();
        if (scroll + param.height > param.jom.height() - param.rate) {
            isScroll = true;
            cb(this);
        }
    }.bind(this));
    this.setScroll = function (b) { isScroll = b };
    cb(this);
}


/*
* 头部筛选条
*
* */