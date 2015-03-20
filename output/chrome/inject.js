// ==UserScript==
// @name inject
// @include http://*
// @include https://*
// @require js/jquery-2.1.3.min.js
// @require js/jquery.livequery.min.js
// @require js/underscore.min.js
// ==/UserScript==


//kango.console.log("HHII");
/**
 * Created by Tim on 2014/4/6.
 */
/*, "background", "notifications", "unlimitedStorage", "webRequest", "webRequestBlocking"*/

//全域變數的宣告。
var root = $('body');
//var port = chrome.runtime.connect();
var queryString = 'div,h1,h2,h3,h4,h5,ul,ol,li,a,table,tr,td,img,font,span';
var blockColor = '#FFccFF';
var currentHighlights = [];

var msg = $('<label>');
var title = $('<label>');

var bottomLine = $('<label>');
var leftLine = $('<label>');
var rightLine = $('<label>');
var topLine = $('<label>');
var confirmPanel = $('<label>');

var borderWidth = '5px';
var borderColor = 'red';
var fontColor = 'white';

var cancelButton = $('<img>');
var border = $('<label>');

var isSelecting = false;


var settings;

//TODO 初始化的宣告，但是有些網站一直讀不完，會導致程式無法run。
//root.ready(initial);

function initial() {

    title.text('請選擇欲擷取的區塊');
    title.css({borderRadius: '10px 10px 0 0 ', padding: '5px', fontSize: '24px', color: fontColor, position: 'fixed', bottom: '0px', left: '50%', marginLeft: '-113px', zIndex: 1000000, backgroundColor: borderColor});

    bottomLine.css({position: 'fixed', backgroundColor: borderColor, zIndex: 1000000, height: borderWidth, left: 0, right: 0, bottom: 0});
    topLine.css({position: 'fixed', backgroundColor: borderColor, zIndex: 1000000, height: borderWidth, left: 0, right: 0, top: 0});
    leftLine.css({position: 'fixed', backgroundColor: borderColor, zIndex: 1000000, width: borderWidth, left: 0, top: 0, bottom: 0});
    rightLine.css({position: 'fixed', backgroundColor: borderColor, zIndex: 1000000, width: borderWidth, right: 0, top: 0, bottom: 0});

    msg.css({borderRadius: '0 0 10px 0', padding: '5px', position: 'fixed', top: '0px', left: '0px', fontSize: '24px', color: fontColor, zIndex: 1000000, backgroundColor: borderColor});
    confirmPanel.css({position: 'fixed', bottom: 10, left: '50%', marginLeft: '-68px', zIndex: 1000000});


    kango.invokeAsync('kango.io.getResourceUrl', 'res/close 3.png', function (data) {
        cancelButton.attr("src", data);
    });


    cancelButton.css({position: 'fixed', width: '40px', height: '40px', top: '0px', right: '0px', zIndex: 1000000, cursor: 'pointer'});

    initDoms();
}



kango.addMessageListener('startBlockSelect', function (e) {
    settings = e.data;
    kango.console.log(settings);
    //kango.console.log("HHII");
    startSelect();
});

kango.addMessageListener('endBlockSelect', function (e) {
    endSelect();
});

//開始選擇區塊
function startSelect() {
    endSelect();
    isSelecting = true;

    root.append(topLine);
    root.append(leftLine);
    root.append(rightLine);
    root.append(bottomLine);
    root.append(title);
    root.append(msg);
    root.append(cancelButton);
    root.append(confirmPanel);

    cancelButton.click(function () {
        endSelect();
    });

}

kango.addMessageListener('fieldPreview', function (e) {
    var field = e.data.field;
    var css = field.path;
    if (field.index != null) {
        css = css + ':eq(' + field.index + ')';
    }
    else {
        css = css + ':eq(' + 0 + ')';
    }
    //kango.console.log("here");
    kango.dispatchMessage('getFieldPreview', $(css).text());
});

kango.addMessageListener('fieldContent', function (e) {
//    kango.console.log("open");
    var fields = e.data.fields;
    var content = $('<div>');
    for (var f in fields) {
        var field = fields[f];
        var idx = 0;
        var css = field.path;
        if (field.index != null) {
            css = css + ':eq(' + field.index + ')';
            idx = field.index;
        }

        var name = $('<h3>').text("區塊： " + field.name).css({backgroundColor: '#f2dede'});
        var path = $('<h4>').text("路徑： " + css).css({backgroundColor: '#f7ecb5'}).addClass('word-break');
        content.append(name);
        content.append(path);


        $(css).each(function (e) {
            content.append($('<h4>').text('編號： ' + idx).css({backgroundColor: '#afd9ee'}));

            var me = $(this);
            if (field.type == 'saveText') {
                content.append($('<h4>').text('本文：').css({backgroundColor: '#d9edf7'}));
                content.append($('<div>').text(me.text()));
            }
            if (field.type == 'saveLink') {
                content.append($('<h4>').text('連結：').css({backgroundColor: '#d9edf7'}));
                content.append($('<div>').text(me.attr('href')));
            }
            if (field.type == 'saveResource') {
                content.append($('<h4>').text('資源：').css({backgroundColor: '#d9edf7'}));
                content.append($('<img>').attr('src',me.attr('src')));
            }
            if (field.type == 'saveHtml') {
                content.append($('<h4>').text('原始碼：').css({backgroundColor: '#d9edf7'}));
                content.append($('<div>').text($("<div>").append(me.clone()).html()));
            }
            content.append($('<hr/>'));
            //}
            idx++;
        });

        content.append($('<br/>'));
    }

    kango.dispatchMessage('getFieldContent', content.html());
});

var maxDeep = 0;
function getDomTree(select, cur, deep, bros) {





//     for(var i=0;i< $('html>*').length;i++){
//
//     }
    if (deep > maxDeep) {
        maxDeep = deep;
    }
    //kango.console.log(select);
    cur.deep = deep;
    cur.maxDeep = deep;
    cur.select = select;
    cur.children = [];
    //if(select.search(":nor")!= -1){
    //    kango.console.log("Error: "+select);
    //    return cur;
    //}
    try{

        //if (maxDeep <= 0) return cur;
        var tagSet = {};
        var ex = _.map(bros, function (v) {
            return ":not(" + v + ")";
        }).join('');

        //kango.console.log(ex);

        $(select + ex + '>*').each(function () {
            if (!tagSet[getToken(this)]) {
                tagSet[getToken(this)] = 1;
            }
            else {
                tagSet[getToken(this)]++;
            }
            //var tag = $(this).prop("tagName");
            //tagSet[getToken(this)] = true;
            //kango.console.log(tag);

        });

        //kango.console.log(deep);

        for (var t in tagSet) {
            var next = {};
            next.name = t;


            next.num = tagSet[t];
            //var ts=split('.');
            var b = _.chain(tagSet)
                .keys()
                .filter(function (s) {
                    if (s === t) return false;

                    //var ss=split('.');
                    if (s.substring(0, t.length) === t) {
                        return true;
                    }
                    //if(ss.length === 1) return true;


                    return false;
                })
                .value();
            cur.children.push(getDomTree(select + '>' + t, next, deep + 1, b));
            if (next.maxDeep > cur.maxDeep) {
                cur.maxDeep = next.maxDeep;
            }
        }

    }catch (e){
        //kango.console.log(e.message);
    }

    return cur;
}


kango.addMessageListener('getDomTree', function (e) {
    kango.console.log("Start get dom tree");
    var tree = getDomTree('html', {name: 'html'}, 0);
    kango.console.log("Finished!");
    kango.console.log(tree);
    //kango.console.log(maxDeep);

    kango.dispatchMessage('domTree', {tree: tree});
});

kango.addMessageListener('pageURL', function (e) {
    var urls = [];
    $('a').each(function () {
        urls.push($(this).attr('href'));
    });
    //kango.console.log(urls);
    kango.dispatchMessage('getPageURL', {re: e.data.re, urls: urls});
});

kango.addMessageListener('pageURL2', function (e) {
    //kango.console.log('pageURL2');
    var urls = [];
    $('a').each(function () {
        urls.push($(this).attr('href'));
    });
    //kango.console.log(urls);
    kango.dispatchMessage('getPageURL2', {urls: urls,isLink: e.data.isLink});
});

//結束選擇區塊
function endSelect() {
    isSelecting = false;
    updateBorder();
    msg.text('');
    cancelButton.remove();
    topLine.remove();
    leftLine.remove();
    rightLine.remove();
    bottomLine.remove();
    title.remove();
    msg.remove();
    confirmPanel.remove();
    title.css({opacity: 1});
    confirmPanel.css({opacity: 0});

    currentHighlights = [];


}

function checkType(dom) {
    if (settings.type == 'saveLink' && $(dom.path + '[href]').size() == 0) {
        return false;
    }
    else if (settings.type == 'saveResource' && $(dom.path + '[src]').size() == 0) {
        return false;
    }
    return true;
}

function initDoms() {


    $(queryString).livequery(function () {
//        kango.console.log($(this).children().length);

        if (this.isSet) {
            return;
        }


        this.isSet = true;
//        var me=$(this);
        $(this).hover(function (e) {
            if (!isSelecting) {
                return;
            }


            var me = $(this);

            if (!this.borderTmp)  this.borderTmp = me.css('box-shadow');
            if (!this.backgroundTmp) this.backgroundTmp = me.css('background-color');
            if (!this.path) this.path = getDomPath(this);

            if (!checkType(this)) {
                return;
            }

            currentHighlights.push(this);

            updateBorder(this);

            e.stopPropagation();


        }, function (e) {
            if (!isSelecting) {
                return;
            }
            var me = $(this);
            me.css({boxShadow: this.borderTmp});
            me.css({backgroundColor: this.backgroundTmp});
            remove(currentHighlights, this);
            updateBorder();
        });

        $(this).click(function (e) {
            if (!isSelecting) {
                return;
            }
            var that = this;
            var me = $(this);

            if (!checkType(this)) {
                return;
            }

            var doms = $(getDomPath(this));
            //doms.css({ transition: 'background 0s', backgroundColor: '#FFccFF'});
            var index = 0;


            for (var i = 0; i < doms.length; i++) {
                //doms.each(function () {
                //kango.console.log(doms[i].path);
                if (getDomPath(doms[i]) != this.path) {
                    continue;
                }
                if (doms[i] === that) {
                    //kango.console.log(index);
                    break;
                }
                index++;
                //});
            }


            me.each(function () {
//                if(this ===  that) kango.console.log(index);
//                index++;

                isSelecting = false;
                var self = this;
                //var me = $(this);
                var offset = me.offset();

                var okButtom = $('<label>');
                var cancelButtom = $('<label>');
                confirmPanel.empty();
                confirmPanel.append(okButtom).append(cancelButtom);
                confirmPanel.css({opacity: 1});
//                var scrollTop = $(window).scrollTop();
//                var top = offset.top + 5 - scrollTop;
//                if (top < 100) {
//                    top = 100 + scrollTop;
//                }

                title.css({opacity: 0});
                var css = {fontSize: 24, backgroundColor: 'OrangeRed', marginRight: '10px', color: 'white', borderRadius: '5px', padding: '5px', border: '5px red solid', cursor: 'pointer'};
                okButtom.text('確定');
                okButtom.css(css);
                okButtom.click(function () {
                    me.css({transition: 'background 1s', backgroundColor: 'none'});

                    if (settings.certain) {
                        //alert(me.text());
                        kango.dispatchMessage('addPath', {path: self.path, index: index, sample:me.text(), sampleURL: window.location.href});
                    }
                    else {
                        //alert(me.text());
                        kango.dispatchMessage('addPath', {path: self.path, sample:me.text(), sampleURL: window.location.href});
                    }

                    title.css({opacity: 1});
                    confirmPanel.css({opacity: 0});
                    endSelect();
                });

//                okCertainButtom.text('');
//                okCertainButtom.css(css);
//                okCertainButtom.click(function () {
//                    me.css({transition: 'background 1s', backgroundColor: 'none'});
//                    kango.dispatchMessage('addPath', {path: self.path, index: index});
//                    title.css({opacity: 1});
//                    confirmPanel.css({opacity: 0});
//                    endSelect();
//                });

                cancelButtom.text('取消');
                cancelButtom.css(css);
                //cancelButtom.css({position: 'absolute', top: offset.top, left: offset.left + me.width() - 50, zIndex: 1000000, border: '1px Red solid'});
                cancelButtom.click(function () {
                    isSelecting = true;
                    me.css({transition: 'background 1s', backgroundColor: 'none'});

                    me.css({boxShadow: self.borderTmp});

                    currentHighlights = [];
                    updateBorder();
                    title.css({opacity: 1});
                    confirmPanel.css({opacity: 0});
                    //kango.console.log(me);

                });


                this.icon = okButtom;
            });


            e.preventDefault();
            e.stopPropagation();
        });
    });
}


//更新選擇的邊框
function updateBorder(current) {
//    var max = 0;
//    var mc;
    for (var i in currentHighlights) {
        var c = currentHighlights[i];
//        if (c.path.length > max) {
//            max = c.path.length;
//            mc = c;
//        }
        var q = $(c);
        q.css({boxShadow: c.borderTmp});
        q.css({backgroundColor: c.backgroundTmp});
    }

    //console.log(currentHighlights);
    if (isSelecting) {
        if (current) {
            var me = $(current);
            me.css({boxShadow: '0 0 0 3px OrangeRed, 0 0 0 3px OrangeRed inset'});
            me.css({backgroundColor: '#FFccFF'});
            msg.text("目前選取的區塊: " + current.path);
            //var offset = me.offset();
            //kango.console.log(me.offset());
            //border.css({left: offset.left, top: offset.top});
            //border.text('this?');
            //border.css({width: me.width(), height: '1px'});
        }
    }
}


kango.addMessageListener('showHighlights', function (e) {
    var pat = e.data;
    showHighlights(pat);
});

kango.addMessageListener('showHighlightByCSS', function (e) {
    var css = e.data;
    $(css).each(function () {
        var me = $(this);
        //me.css({transition: 'background 0.0s', backgroundColor: blockColor});
        me.css({boxShadow: '0 0 0 3px OrangeRed, 0 0 0 3px OrangeRed inset'});
    });
});

kango.addMessageListener('hideHighlights', function (e) {
    var pat = e.data;
    hideHighlights(pat);
});

//更新 高亮顯示
function showHighlights(field) {
    var css = field.path;
    if (field.index != null) {
        css += ":eq(" + field.index + ")";
    }
    //kango.console.log(field);
    //kango.console.log(css);
    $(css).each(function () {
        var me = $(this);
        //me.css({transition: 'background 0.0s', backgroundColor: blockColor});
        me.css({boxShadow: '0 0 0 3px OrangeRed, 0 0 0 3px OrangeRed inset'});
    });

}

function hideHighlights(field) {
    //kango.console.log(pat);
    //$(field.path).css({transition: 'background 0.0s', backgroundColor: 'none'});
    $(field.path).css({boxShadow: 'none'});
}

function remove(arr, element) {
    var idx = arr.indexOf(element);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
}


//更新 高亮顯示
function showHighlightsByRegex(path, color, pattern) {
    var regex = new RegExp(pattern);
    //console.log(path);
    $(path).each(function (e) {
        var me = $(this);
        if (regex.test(me.prop('href'))) {
            me.css({transition: 'background 1s', backgroundColor: color});
        }
    });
}

function getToken(element) {
    var eleSelector = element.tagName.toLowerCase();
    if (element.id && !element.id.match(/\d/)) {

        //console.log(element.id);
        //console.log(element.id);
        try {
            var testID = "#" + element.id;
            if ($(testID).length != 0) {
                eleSelector = testID;
            }
            //console.log(testID);
        }
        catch (e) {
            //console.log(e);
        }
    }

    //console.log(eleSelector);
//        +
//            ((inner.length > 0) ? ':contains(\'' + inner + '\')' : '');
    if (element.className) {
        var goodClasses = [];
        var classNames = element.className.split(" ");
        for (var i in classNames) {
            var cn = classNames[i];
            if (cn != "" && !cn.match(/\d/)) {
                goodClasses.push(cn);
            }
        }

        var testClass = eleSelector + "." + goodClasses.join('.');
        //element.className.trim().replace(/ ./g, '.');
        try {
            if ($(testClass).length != 0) {
                eleSelector = testClass;
            }
        }
        catch (e) {

        }

        //console.log(element.className);
        //eleSelector += "." + element.className.trim().replace(/ ./g, '.');
    }
    return eleSelector;
}

function getDomPath(element) {
    var path = '';
    for (; element && element.nodeType == 1 && element.tagName.toLowerCase() !== "html"; element = element.parentNode) {
        //var inner = $(element).children().length == 0 ? $(element).text() : '';


        path = '>' + getToken(element) + path;
    }
    //console.log(path);
    //console.log($(testID).length);

    path = 'html' + path;
    path = path.trim();

    /*
     if (path.indexOf("#") > -1) {
     var tokens = path.split('#');
     path = '#' + tokens[tokens.length - 1];
     }
     */


    //console.log('path: ' + path);

    return path;
}

function createPreviewWindow() {
    $("<div>").css();


}

//console.log("Hi");
initial();
