var docEl = document.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        //设置根字体大小
        var myfontSize = 20 * (docEl.clientWidth / 375);
        if (myfontSize > 30) {
            docEl.style.fontSize = "30px";
        } else {
            docEl.style.fontSize = 20 * (docEl.clientWidth / 375) + 'px';
        }

    };
//绑定浏览器缩放与加载时间
window.addEventListener(resizeEvt, recalc, false);
document.addEventListener('DOMContentLoaded', recalc, false);
document.body.addEventListener('touchstart', function () {
});

(function ($) {
    $.fn.alert = function () {
        return this.fadeIn(500).addClass('animation-show').removeClass('animation-hide')
    };
    $.fn.leave = function () {
        return this.addClass('animation-hide').removeClass('animation-show').fadeOut(500)
    };
    $.extend({
        toast: (a) => {
            $('.tips').slideDown(200).text(a);
            setTimeout(() => {
                $('.tips').slideUp(600)
            }, 1000)
        }
    }
    );


})(jQuery);
/*底部Tab*/

$('.tab ul li').on('click', function () {
    const ID = $(this).index()
    switch (ID) {
        case 0:
            location.href = 'index.html';
            break;
        case 1:
            location.href = 'holdPosition.html';
            break;
        case 2:
            location.href = 'master.html';
            break;
    }
})

function toDOU(n) {
    return n < 10 ? '0' + n : '' + n
}

function time2date(tt) {
    const timestamp = Date.parse(tt)
    const oDate = new Date();
    oDate.setTime(timestamp)
    return oDate.getFullYear() + '-' + toDOU(oDate.getMonth() + 1) + '-' + toDOU(oDate.getDate()) + ' ' + toDOU(oDate.getHours()) + ':' + toDOU(oDate.getMinutes())
        + ':' + toDOU(oDate.getSeconds())

}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
function clearCookie(name) {
    setCookie(name, "", -1);
}