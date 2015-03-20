// ==UserScript==
// @name Test
// @require storageServices.js
// ==/UserScript==


//只有不確定popup.up 是否會在關閉的時候變動，才需要依賴背景作業。
//目前只有 tab 和 addPath 需要
function BlockEditor() {
    var me = this;
    var BGValues = {};

    Object.defineProperty(me, 'storageService', {
        get: function () {
            if (settings.offline) {
                return LocalStorageService;
            }
            return RemoteStorageService;
        }
    });


    function bindBGValue(name) {

        Object.defineProperty(me, name, {
            set: function (value) {
                if (BGValues[name] == value) return;
                BGValues[name] = value;
                //kango.console.log("S: " + name + ":" + BGValues[name]);
                kango.dispatchMessage('changeValue', {name: name, value: value});
            },
            get: function () {
                if (BGValues[name] === undefined) {
                    BGValues[name] = null;
                }
                //kango.console.log("H: " + name + ":" + client[name]);
                return BGValues[name];
            }
        });
    }

    bindBGValue('currentTab');
    bindBGValue('selecting');
    bindBGValue('selectedField');

    kango.addMessageListener('BGValues', function (e) {
        for (var v in BGValues) {
            kango.dispatchMessage('changeValue', {name: v, value: BGValues[v]});
        }
    });


//
//    kango.addMessageListener('taskList', function (e) {
////        if (e.data != -1 && me.taskList.length != 0) {
////            me.currentIndex = e.data;
////        }
//        me.storageService.read(function (list) {
//            me.taskList = list;
//
//
//
//            kango.dispatchMessage('getTaskList', {
//                taskList: me.taskList,
//                currentIndex: me.currentIndex,
//                currentTitle: me.currentTitle,
//                currentPage: me.currentPage,
//                cacheTask: me.cacheTask,
//                showTaskDetail: me.showTaskDetail,
//                currentTab: me.currentTab,
//                fields: me.fields
////                cacheIndex: me.cacheIndex
//            });
//        });
//
//    });


//    kango.addMessageListener('setCurrentIndex', function (e) {
//        me.currentIndex = e.data.currentIndex;
//    });
//
//    kango.addMessageListener('updateCurrentTask', function (e) {
//        if (!e.data.currentTask) return;
//        me.taskList[me.currentIndex] = e.data.currentTask;
//        //me.updateTask(me.taskList[me.currentIndex]);
//    });

//    kango.addMessageListener('saveCurrentTask', function (e) {
//        var task = e.data.cacheTask;
//        if (task.id) {
//            me.updateTask(task);
//        }
//        else {
//            me.newTask(task);
//        }
//        me.cacheTask = null;
//        //if()
//        //if (!e.data.currentTask) return;
//        //me.taskList[me.currentIndex] = e.data.currentTask;
//        //me.updateTask(me.taskList[me.currentIndex]);
//    });

//    kango.addMessageListener('cacheCurrentTask', function (e) {
//        if (!e.data.cacheTask) return;
//        //me.taskList[me.currentIndex] = e.data.currentTask;
//        me.cacheTask = e.data.cacheTask;
//        kango.console.log(e.data.fields);
//        if (!e.data.fields) return;
//        me.fields=[];
//        for(var f in e.data.fields){
//            var field= e.data.fields[f];
//            delete field['$$hashKey'];
//            me.fields.push(field);
//        }
//        //me.taskList[me.currentIndex] = e.data.currentTask;
//        //me.fields = e.data.fields;
//    });

//    kango.addMessageListener('togglePattern', function (e) {
//        var pat = e.data.pattern;
//        var highlight = e.data.highlight;
//        me.togglePattern(pat, highlight);
//    });

//    kango.addMessageListener('showHighlights', function (e) {
//        me.showHighlights(e.data);
//
//    });
//
//    kango.addMessageListener('hideHighlights', function (e) {
//        me.hideHighlights(e.data);
//    });
//
//    kango.addMessageListener('newTask', function (e) {
//        me.newTask();
//    });

//    kango.addMessageListener('removeTask', function (e) {
//        me.removeTask(e.data);
//    });

//    kango.addMessageListener('startBlockSelect', function (e) {

//        kango.browser.tabs.getAll(function (tabs) {
//            // tab is KangoBrowserTab object
//            //kango.console.log(tab);
////            for (var i = 0; i < tabs.length; i++) {
////                //kango.console.log(tabs[i].getUrl());
////                tabs[i].dispatchMessage('startBlockSelect', '');
////            }
//
//
//            //tab.dispatchMessage('startBlockSelect', '');
//        });
    //me.fid = e.data.fid;

    //kango.console.log(me.currentTab);
//        if (me.currentTab) {
//            me.currentTab.dispatchMessage('startBlockSelect', '');
//            me.selecting = true;
//        }
//    });

    kango.addMessageListener('addPath', function (e) {
        var state = JSON.parse(kango.storage.getItem("state"));
        var field;
        var fid = state.fid;
        var fid2 = state.fid2;
        kango.console.log(state);
        kango.console.log(fid);
        kango.console.log(fid2);
        if (fid2 === undefined) {
            field = state.currentTask.fields[fid];
        } else {
            field = state.currentTask.fields[fid].fields[fid2];
        }

        kango.console.log(field);
        field.path = e.data.path;
        field.index = e.data.index;
        field.sample = e.data.sample;
        field.sampleURL = e.data.sampleURL;

        kango.storage.setItem("state", state);
        kango.dispatchMessage('changeValue', {name: 'currentTask', value: state.currentTask});

        me.currentTab.dispatchMessage('endBlockSelect', '');
        me.selecting = false;
//
//        me.selectedField = {
//            path: e.data.path,
//            index: e.data.index
//        };
//
//        if (me.fid <= -1) {
//
//            //        var targetTask;
//            me.cacheTask.fields.push({
////        me.taskList[me.currentIndex].fields.push({
//                path: e.data.path,
////            highlight: true,
//                index: e.data.index,
//                saveText: true,
//                //task: 'pattern ' + currentTask.fields.length,
//                color: settings.color,
//                fields: []
//            });
//        }
//        else {
//            me.cacheTask.fields[me.fid].path = e.data.path;
//            me.cacheTask.fields[me.fid].index = e.data.index;
//        }
//
//        kango.dispatchMessage('updateView', {cacheTask: me.cacheTask});

//        kango.browser.tabs.getAll(function (tabs) {
//            // tab is KangoBrowserTab object
//            //kango.console.log(tab);
//            for (var i = 0; i < tabs.length; i++) {
//                //kango.console.log(tabs[i].getUrl());
//                tabs[i].dispatchMessage('endBlockSelect', '');
//            }
//            //tab.dispatchMessage('endBlockSelect', '');
//        });

        //kango.console.log(e);
        //me.updateTask(me.taskList[me.currentIndex]);
    });

//    kango.addMessageListener('saveState', function (e) {
//        var data = e.data;
//        if (data.currentTitle) {
//            me.currentTitle = data.currentTitle;
//        }
//        if (data.currentPage) {
//            me.currentPage = data.currentPage;
//        }
//        if (data.currentIndex) {
//            me.currentIndex = data.currentIndex;
//        }
//        if (data.showTaskDetail != null) {
//            me.showTaskDetail = data.showTaskDetail;
//            //kango.console.log(me.showTaskDetail);
//        }
//    });

//    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function(event) {
//        var myWindow = window.open("popup.html", "Test", "width=800, height=600");
//        kango.console.log('Button clicked');
//    });


//    kango.addMessageListener('getServer', function (e) {
//        kango.dispatchMessage('server', settings.server);
//    });
//
//    kango.addMessageListener('setServer', function (e) {
//        settings.server = e.data;
//    });


    function checkAndStopSelecting() {
        if (me.selecting == true) {
            me.currentTab.dispatchMessage('endBlockSelect', '');
            me.selecting = false;
        }
    }

    function setCurrentTab(e) {
        if (e.url[0] != 'c') {
            me.currentTab = e.target;
        }
    }

    kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function (e) {
        checkAndStopSelecting();
        setCurrentTab(e);
    });

    kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, function (e) {
        checkAndStopSelecting();
        setCurrentTab(e);
    });

//
//    // 和當前頁面互動的訊息傳遞。
//    chrome.runtime.onConnect.addListener(function (p) {
//        var port = p;
//
//        //console.log(port.task == "knockknock");
//        var tab = port.sender.tab;
//
//        port.onMessage.addListener(function (data) {
//            var type = data.type;
//            console.log(type);
//            //port.postMessage({ack: "200"});
//
//            switch (type) {
//                case 'addPath':
//                    currentTask.fields.push({
//                        path: data.path,
//                        highlight: true,
//                        //task: 'pattern ' + currentTask.fields.length,
//                        color: '#FFccFF'
//                    });
//                    updateTask(currentTask);
//                    //chrome.tabs.create({url:"popup.html"});
//                    break;
//                case
//                'start'
//                :
//                    port();
//                    //chrome.tabs.remove(tab.id);
//                    break;
//                case
//                'fin'
//                :
//                    var tid = data.tid;
//                    releaseCrawlerTab();
//                    //chrome.tabs.remove(tid);
//
//                    break;
//                default :
//                    break;
//            }
//        });
//    });

//    me.loadTasks();
}

BlockEditor.prototype = {

    taskList: [],
//    currentTask: '',
    currentIndex: 0,
    taskNum: 'task_number'
//    storageService: LocalStorageService,

//    loadTasks: function () {
//        var me = this;
//        me.storageService.read(function (list) {
//            me.taskList = list;
//
//            for (var i = 0; i < me.taskList.length; i++) {
//                if (!me.taskList[i].fields) {
//                    me.taskList[i].fields = [];
//                }
//            }
//
//        })
//    },

    //按下新任務後馬上執行，並取得taskID。
//    newTask: function (task) {
//        var me = this;
//        //var task = new Task();
//        //task.name = 'task';
//        me.storageService.create(task, function (taskID) {
//            //console.log(taskID);
//            task.id = taskID;
//
//        });
//
//        //需同時新增taskList 裡面的task
//        me.taskList.push(task);
//    },

    //根據task 的ID 移除 該task。
//    removeTask: function (task) {
//        var me = this;
//        //需同時移除taskList 裡面的task
//        remove(me.taskList, task);
//        me.storageService.remove(task);
//
//        //console.log('remove');
//    },

//    //根據task 的ID 更新該task。
//    updateTask: function (task) {
//        var me = this;
//        me.storageService.update(task);
//    },


    // 開始進行選擇區塊(當user 按下新增區塊後執行)，對應的func 請參考inject.js。
//    startBlockSelect: function () {
//        chrome.tabs.executeScript({code: 'startSelect();'});
//    },


//    togglePattern: function (pattern, highlight) {
//        var me = this;
//        if (!highlight) {
////            pattern.highlight = false;
//            me.hideHighlights(pattern);
//        }
//        else {
////            pattern.highlight = true;
//            me.showHighlights(pattern);
//        }
//    },
//
//    showHighlights: function (pattern) {
////        kango.browser.tabs.getCurrent(function (tab) {
////            // tab is KangoBrowserTab object
////            //kango.console.log(tab);
////            //kango.console.log(pattern);
////            tab.dispatchMessage('showHighlights', pattern);
////        });
//        var me = this;
//        if (me.currentTab) {
//            me.currentTab.dispatchMessage('showHighlights', pattern);
//        }
//    },
//
//    hideHighlights: function (pattern) {
////        kango.browser.tabs.getCurrent(function (tab) {
////            // tab is KangoBrowserTab object
////            //kango.console.log(tab);
////            tab.dispatchMessage('hideHighlights', pattern);
////        });
//        var me = this;
//        if (me.currentTab) {
//            me.currentTab.dispatchMessage('hideHighlights', pattern);
//        }
//    }

//
//    _onCommand: function () {
//        kango.browser.tabs.create({url: 'http://kangoextensions.com/'});
//    }
};


function Task() {
    this.id = "";
    this.name = "";

    this.fields = [];
    this.state = 'stop';
    this.baseURL = "";
    this.rootURL = "";

    this.linkPage = "";
    this.targetPage = "";

}

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

var bg = new BlockEditor();

