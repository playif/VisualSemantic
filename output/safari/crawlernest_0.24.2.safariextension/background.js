/**
 * Created by Tim on 2014/4/6.
 */


var port;


var taskList = [];
var currentTask;
var currentIndex = 0;


var taskNum = 'task_number';

var storageService = LocalStorageService;


// 內部創造一個task，可視為task 的建構子。
//function createTask() {
//    var task = {};
//    task.id = "";
//    task.task = "";
//    task.rootURL = "";
//    task.subPage = "";
//    task.homePage = "";
//    task.baseURL = "";
//
//    task.fields = [];
//
//    task.state = 'idle';
//
//    return task;
//}

// task 的建構子實作。
function Task() {
    //var task = {};
    this.id = "";
    this.task = "";
//    this.urls = {};
//    this.finishedURLs = {};
    this.fields = [];
//task.sourcePatterns = {};
    this.state = 'stop';
    this.targetPage = "";
    this.rootURL = "";
    this.baseURL = "";
    this.homePage = "";
    this.linkPage = "";

    //return task;
}


//該行為只有在每次啟動chrome的時候會執行。
function loadTasks() {
    storageService.read(function (list) {
        taskList = list;

        for (var i = 0; i < taskList.length; i++) {
            if (!taskList[i].fields) {
                taskList[i].fields = [];
            }
        }

    });
}
loadTasks();

//function saveTasks() {
//    localStorage['task_list'] = JSON.stringify(taskList);
//}

//按下新任務後馬上執行，並取得taskID。
function newTask() {

    var task = new Task();
    task.task = 'task';
    storageService.create(task, function (taskID) {
        console.log(taskID);
        task.id = taskID;

    });

    //需同時新增taskList 裡面的task
    taskList.push(task);
}

//根據task 的ID 移除 該task。
function removeTask(task) {
    //需同時移除taskList 裡面的task
    remove(taskList, task);
    storageService.remove(task);

    console.log('remove');
}

//根據task 的ID 更新該task。
function updateTask(task) {
    storageService.update(task);
}

//var task = {};
//task.task = "";
//task.urls = {};
//task.finishedURLs = {};
//task.fields = [];
////task.sourcePatterns = {};
//task.state = 'idle';


//indexed DB 原本要儲存網頁用的，先註解掉了。

//var server;
//db.open({
//    server: 'my-app2',
//    version: 8,
//    schema: {
//        people: {
//            key: { keyPath: 'id', autoIncrement: true },
//            // Optionally add indexes
////            indexes: {
////                firstName: { unique:false },
////                answer: { unique:false },
////                midName: { unique:false }
////            }
//        }
//    }
//}).done(function (s) {
//    server = s;
//
//    server.people.add({
//        firstName: 'Aaron',
//        lastName: 'Powell',
//        answer: 42,
//        midName: 'test'
//    }).done(function (item) {
//        // item stored
//    });
////    for(var i=0;i<100000000;i++){
////        server.people.add( {
////            firstName: 'Aaron12',
////            lastName: 'Powell121',
////            answer: 42212,
////            midName: 'test22122'
////        } ).done( function ( item ) {
////            // item stored
////        } );
////    }
//
//});


// 開始進行選擇區塊(當user 按下新增區塊後執行)，對應的func 請參考inject.js。
function startBlockSelect() {
    chrome.tabs.executeScript({code: 'startSelect();'});
}

//沒用到，先註解掉。
//
//function stopTask() {
//    task.state = 'idle';
//}


// 目前用不到
function createCrawlerTab() {
    chrome.tabs.create({url: 'blank:', active: false, pinned: true}, function (tab) {
        idleCrawlers++;
        var crawlerData = {};
        crawlerData.id = tab.id;
        crawlerData.state = 'idle';
        crawlerData.url = '';
        crawlerTabs[tab.id] = crawlerData;
    });
}

//chrome.tabs.onRemoved.addListener(function (tid) {
//    console.log(crawlerTabs);
//    console.log(tid);
//    console.log(crawlerTabs[tid]);
//    if (crawlerTabs[tid]) {
//        var crawlerData = crawlerTabs[tid];
//        if (crawlerData.state = 'crawling') {
//
//        }
//
//        delete crawlerTabs[tid];
//        //TODO remove logic
//        //remove(tab, crawlerTabs);
//    }
//});

function getIdelCrawler() {

}

//function getCrawlPage(crawler) {
//    chrome.tabs.update(crawler.id, {url: crawler.url}, function (tab) {
//        chrome.tabs.executeScript(tab.id, {code: 'initial();'}, function () {
//            //TODO send current tab.id
//            chrome.tabs.executeScript(tab.id, {code: ''});
//        });
//
//
//    });
//}

function remove(arr, obj) {
    for (var i = arr.length; i--;) {
        if (arr[i] === obj) {
            arr.splice(i, 1);
        }
    }
}

function size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

//setInterval(loop, 500);


//function releaseCrawlerTab(tid) {
//    idleCrawlers++;
//
//}
//window.open("background.html.old#0", "bg", "background");

//function loop() {
//    if (task.state = 'run') {
//        if (size(task.urls) > 0) {
//            if (idleCrawlers > 0) {
//
//                var crawler = getIdelCrawler();
//
//
//            }
//        }
//    }
////    chrome.tabs.
//
////    chrome.tabs.captureVisibleTab(function (dataURL) {
//
////    chrome.tabs.create({url: 'http://s.weibo.com/weibo/%E5%8C%97%E4%BA%AC', active: false}, function (tab) {
//////            chrome.windows.create({tabId: tab.id,  focused: false}, function (window) {
//////                chrome.windows.update(window.id, {state: 'minimized'});
////
//////            chrome.tabs.highlight({tabs:tab.id},function(){
//////
//////            });
////        chrome.tabs.executeScript(tab.id, {file: 'inject.js'});
////        i += 1;
////
//////        var iframe=$('<iframe>');
//////        iframe.prop('src','http://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension');
//////        iframe.appendTo($('body'));
//////        iframe.width=500;
//////        iframe.height=500;
////
////
//////        setTimeout(function () {
//////            var notification = webkitNotifications.createNotification("",
//////                    "Simple Background App " + i,
//////                    "A background window has been created" + tab.status);
//////            notification.show();
//////            chrome.tabs.remove(tab.id);
//////            iframe.remove();
//////        }, 2000);
////
////
//////            });
////
////    });
////
////
//////    });
//
//}

//function removeCurrentTab() {
//    chrome.tabs.getCurrent(function (tab) {
//        chrome.tabs.remove(tab.id);
//    });
//}


//chrome.tabs.onUpdated.addListener(function () {
//
//});

//chrome.webRequest.onHeadersReceived.addListener(
//    function(info) {
//        var headers = info.responseHeaders;
//        for (var i=headers.length-1; i>=0; --i) {
//            var header = headers[i].task.toLowerCase();
//            if (header == 'x-frame-options' || header == 'frame-options') {
//                headers.splice(i, 1); // Remove header
//            }
//        }
//        return {responseHeaders: headers};
//    },
//    {
//        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
//        types: [ 'sub_frame' ]
//    },
//    ['blocking', 'responseHeaders']
//);


function togglePattern(pattern, highlight) {
    if (!highlight) {
        pattern.highlight = false;
        hideHighlights(pattern);
    }
    else {
        pattern.highlight = true;
        showHighlights(pattern);
    }
}

function showHighlights(pattern) {
    //console.log(pattern.path);
    chrome.tabs.executeScript({code: 'showHighlights("' + pattern.path + '","' + pattern.color + '");'});
}

function hideHighlights(pattern) {
    //console.log(path);
    chrome.tabs.executeScript({code: 'hideHighlights("' + pattern.path + '","' + pattern.color + '");'});
}

//chrome.browserAction.onClicked.addListener(function (tab) {
//    chrome.tabs.executeScript({file: 'inject.js'});
//    //alert(i);
////    var notification = webkitNotifications.createNotification("",
////            "Simple Background App " + i,
////        "A background window has been created");
////    notification.show();
////    chrome.tabs.captureVisibleTab(function (dataURL) {
////        chrome.tabs.create({url: dataURL});
////    });
////    chrome.tabs.highlight(null,tab);
////    var iframe=$('<iframe>').text('HI').appendTo($('body'));
//
//});


// 和當前頁面互動的訊息傳遞。
chrome.runtime.onConnect.addListener(function (p) {
    var port = p;

    //console.log(port.task == "knockknock");
    var tab = port.sender.tab;

    port.onMessage.addListener(function (data) {
        var type = data.type;
        console.log(type);
        //port.postMessage({ack: "200"});

        switch (type) {
            case 'addPath':
                currentTask.fields.push({
                    path: data.path,
                    highlight: true,
                    //task: 'pattern ' + currentTask.fields.length,
                    color: '#FFccFF'
                });
                updateTask(currentTask);
                //chrome.tabs.create({url:"popup.html"});
                break;
            case
            'start'
            :
                port();
                //chrome.tabs.remove(tab.id);
                break;
            case
            'fin'
            :
                var tid = data.tid;
                releaseCrawlerTab();
                //chrome.tabs.remove(tid);

                break;
            default :
                break;
        }
    });
});