/**
 * Created by Tim on 2014/4/7.
 */
'use strict';

//var Client = function () {
//    this.currentPage = 'view_task';
//
//};
//
//Client.prototype.save = function ($scope) {
//    var value = angular.toJson($scope);
//    kango.console.log(value);
//    kango.storage.setItem('state', value);
//};


//p:not(:nth-of-type(1)):not(:nth-of-type(3))

//var data = [
//    {name: "p1", children: [
//        {name: "c1"},
//        {name: "c2"},
//        {name: "c3"},
//        {name: "c4"},
//        {name: "c3"},
//        {name: "c4"}
//    ]}
//];

//d3.selectAll("#d3")
//    .data([4, 8, 15, 16, 23, 42])
//    .enter().append("p")
//    .text(function (d) {
//        return "I’m number " + d + "!";
//    });
//
//var width = 400, height = 200, radius = 10, gap = 50;
//
//// test layout
//var nodes = [];
//var links = [];
//data.forEach(function (d, i) {
//    d.x = width / 4;
//    d.y = height / 2;
//    nodes.push(d);
//    d.children.forEach(function (c, i) {
//        c.x = 3 * width / 4;
//        c.y = gap * (i + 1) - 2 * radius;
//        nodes.push(c);
//        links.push({source: d, target: c});
//    })
//});
//
//var color = d3.scale.category20();
//var svg = d3.select("#d3").append("svg")
//    .attr("width", width)
//    .attr("height", height)
//    .append("g");
//
//svg.selectAll('*').remove();
//
//
//var diagonal = d3.svg.diagonal()
//    .source(function (d) {
//        return {"x": d.source.y, "y": d.source.x};
//    })
//    .target(function (d) {
//        return {"x": d.target.y, "y": d.target.x};
//    })
//    .projection(function (d) {
//        return [d.y, d.x];
//    });
//
//var link = svg.selectAll(".link")
//    .data(links)
//    .enter().append("path")
//    .attr("class", "link")
//    .attr("d", diagonal);
//
//var circle = svg.selectAll(".circle")
//    .data(nodes)
//    .enter()
//    .append("g")
//    .attr("class", "circle");
//
//var el = circle.append("circle")
//    .attr("cx", function (d) {
//        return d.x
//    })
//    .attr("cy", function (d) {
//        return d.y
//    })
//    .attr("r", radius)
//    .style("fill", function (d) {
//        return color(d.name)
//    })
//    .append("title").text(function (d) {
//        return d.name
//    });


//'ui.sortable',
var app = angular.module('editor', ['ui.bootstrap', 'ui.tree', 'ui.sortable', 'd3', 'editor.directives']);
app.controller('EditorController', ['$scope', '$sce', '$modal', function ($scope, $sce, $modal) {
    var $$ = $scope;
    var client = {};
    var backgroundValues = {};

    function bind(name, defaultValue) {

        Object.defineProperty($$, name, {
            set: function (value) {
                if (angular.equals(client[name], value)) {
                    return;
                }

                client[name] = value;
                kango.storage.setItem("state", angular.toJson(client));
                kango.console.log("S: " + name + ":" + client[name]);
                kango.dispatchMessage('changeValue', {name: name, value: value});
            },
            get: function () {
                if (client[name] === undefined) {
                    var value = kango.storage.getItem("state");

                    if (value === null) {
                        client[name] = defaultValue;
                    }
                    else {
                        var json = angular.fromJson(value);
                        if (json[name] === undefined) {
                            client[name] = defaultValue;
                        }
                        else if (!angular.equals(client[name], json[name])) {
                            client[name] = json[name];
                        }
                    }
                }
                //kango.console.log("H: " + name + ":" + client[name]);
                return client[name];
            }
        });
    }

    KangoAPI.onReady(function () {
        $$.$apply(function () {
            $$.popup = QueryString.popup;
            bind('currentPage', 'view_task');
            bind('currentTask', null);
            bind('tempTask', null);
            bind('currentIndex', -1);
            bind('currentTitle', "");
            bind('showTaskDetail', true);
            bind('fid', "-1");
            bind('fid2', undefined);
            bind('step1', true);
            bind('step2', true);

//            $$.step1=true;
//            $$.step2=true;
            $$.undoStack = [];
            $$.redoStack = [];
            $$.skipOnce = false;
        });

        RemoteStorageService.user(function (obj) {
            $$.$apply(function () {
                $$.userName = obj.username;

                /*
                 $$.taskList = list;

                 //舊版對應。
                 function initField(field) {
                 if (!field.fields) {
                 field.fields = [];
                 }
                 else {
                 for (var f in field.fields) {
                 initField(field.fields[f]);
                 }
                 }
                 }

                 for (var i = 0; i < $$.taskList.length; i++) {
                 initField($$.taskList[i]);
                 }*/
            });
        });


        $$.typeNames = {
            "saveResources": "資源",
            "saveLink": "網址",
            "saveHtml": "原始碼",
            "saveText": "文字"
        };

        $$.getTypeName = function (field) {
            if (!field.type) {
                field.type = "saveText";
            }
            return $$.typeNames[field.type];
        };

        $$.setFieldType = function (field, type) {
            if (field.type == type)return;
            field.type = type;
            field.path = '';
        };

        var scroll;
        var notSave = 0;
        //var prepareToSave = false;
        $(window).bind('keydown', function (e) {
            kango.console.log(e.which);
            if (e.which === 90 && e.ctrlKey) {
                if ($$.undoStack.length > 1) {
                    scroll = $(window).scrollTop();
                    $$.redoStack.push($$.undoStack.pop());
                    var task = angular.fromJson($$.undoStack[$$.undoStack.length - 1]);
                    $$.skipOnce = true;
                    $$.currentTask = task;
                    $$.$digest();
                    setTimeout(function () {
                        $(window).scrollTop(scroll);
                    }, 0);

                    kango.console.log($$.undoStack);

                }
                e.preventDefault();
                e.stopPropagation();
            }

            if (e.which === 65 && e.ctrlKey) {
                if ($$.redoStack.length > 0) {
                    scroll = $(window).scrollTop();
                    var redo = $$.redoStack.pop();
                    $$.undoStack.push(redo);
                    var task = angular.fromJson(redo);
                    $$.skipOnce = true;
                    $$.currentTask = task;
                    $$.$digest();
                    setTimeout(function () {
                        $(window).scrollTop(scroll);
                    }, 0);

                    kango.console.log(scroll);

                }
                e.preventDefault();
                e.stopPropagation();
            }

            if (e.which < 100) {

            }

        });


        function prepareToSave() {
            setTimeout(function () {
                if (notSave > 0) {
                    notSave -= 1;
                }
                if (!notSave) {
                    if ($$.currentTask) {
                        var json = angular.toJson($$.currentTask);

                        $$.undoStack.push(json);
                        $$.redoStack.length = 0;

                        kango.console.log($$.undoStack);

                    }
                    //prepareToSave = false;
                }
            }, 33);
        }


        $$.$watch('currentTask', function (newValue) {
            if ($$.skipOnce == true) {
                $$.skipOnce = false;
            }
            else {
                //prepareToSave = true;
                notSave += 1;
                prepareToSave();
            }

            //$$.currentStackIndex = $$.undoStack.length;


            kango.storage.setItem("state", angular.toJson(client));
            kango.dispatchMessage('changeValue', {name: 'currentTask', value: $$['currentTask']});
        }, true);


        RemoteStorageService.read(function (list) {
            $$.$apply(function () {
                $$.taskList = list;

                //舊版對應。
                function initField(field) {
                    if (!field.fields) {
                        field.fields = [];
                    }
                    else {
                        for (var f in field.fields) {
                            initField(field.fields[f]);
                        }
                    }
                }

                for (var i = 0; i < $$.taskList.length; i++) {
                    initField($$.taskList[i]);
                }
            });
        });


        kango.addMessageListener('changeValue', function (e) {
            $$.$apply(function () {
                var change = e.data;
                $$[change.name] = change.value;
            });
        });

        kango.dispatchMessage('BGValues', '');


//        kango.addMessageListener('changeBGValue', function (e) {
//            changeValue(e);
//        });

//        $scope.highlightAllBlockByID = function (taskIndex) {
//            var task = $scope.taskList[taskIndex];
//            if (!task) return;
//            for (var i = 0; i < task.fields.length; i++) {
//                var field = task.fields[f];
//                kango.dispatchMessage('showHighlights', field);
//            }
//        };
//
//
//
//        $scope.removeAllhighlightByID = function (taskIndex) {
//            var task = $scope.taskList[taskIndex];
//            if (!task) return;
//            for (var f in task.fields) {
//                var field = task.fields[f];
//                kango.dispatchMessage('hideHighlights', field);
//            }
//        };

//        $scope.highlightAllBlock = function (task) {
//            if (!task) return;
//            for (var f in task.fields) {
//                var field = task.fields[f];
//                kango.dispatchMessage('showHighlights', field);
//            }
//        };

        $$.removeHighlight = function () {
            kango.console.log("log");
            if ($$.currentTab) {
                for (var f in $$.currentTask.fields) {
                    var field = $$.currentTask.fields[f];
                    $$.currentTab.dispatchMessage('hideHighlights', field);

                    for (var g in field.fields) {
                        var subField = field.fields[g];
                        $$.currentTab.dispatchMessage('hideHighlights', subField);
                    }
                }
                //$$.currentTab.dispatchMessage('hideHighlights', field);
            }
        };


        $$.highlightBlock = function (field) {
            if ($$.currentTab) {
                $$.currentTab.dispatchMessage('showHighlights', field);
            }
        };

        $$.highlightByCSSs = function (css) {

            if ($$.currentTab) {
                $$.currentTab.dispatchMessage('showHighlightByCSS', css);
            }
        };

        $$.getCSSByURLs = function (urls) {
            var css = [];

            for (var u in urls) {
                css.push('a[*~="' + urls[u] + '"]');
            }
            return css;
        };

        $$.setHighlight = function (field) {
            $$.removeHighlight();
            $$.highlightBlock(field);
        };

        $$.unsetHighlight = function (field) {
            //kango.console.log("set");
            //kango.console.log(field);
            if ($$.currentTab) {
                $$.currentTab.dispatchMessage('hideHighlights', field);
            }

            //$$.removeHighlight();
            //$$.highlightBlock(field);
        };


//        $scope.removeHighlight = function (field) {
//            if ($$.currentTab) {
//                $$.currentTab.dispatchMessage('hideHighlights', field);
//            }
////            if (!task) return;
////            for (var f in task.fields) {
////                var field = task.fields[f];
////                kango.dispatchMessage('hideHighlights', field);
////            }
//        };


//
//        $scope.removehighlight = function (field) {
//            kango.dispatchMessage('hideHighlights', field);
//        };

        //kango.dispatchMessage('taskList', -1);


        kango.addMessageListener('closePopup', function () {
            KangoAPI.closeWindow();
        });


        $$.openRootPage = function () {
            kango.browser.tabs.create({url: $$.currentTask.rootURL});
        };

        $$.testTargetPage = function () {
            if (!$$.currentTask || !$$.currentTab) return false;
            var regex = new RegExp($$.currentTask.targetPage);
            return regex.test($$.currentTab.getUrl());
        };

        $$.setPageTitle = function () {
            if (!$$.currentTask || !$$.currentTab) return false;
            $$.currentTask.name = $$.currentTab.getTitle();
        };

        $$.setPageUrl = function () {
            if (!$$.currentTask || !$$.currentTab) return false;
            $$.currentTask.rootURL = $$.currentTab.getUrl();
        };

//        kango.addMessageListener('updateView', function (e) {
//            $$.$apply(function () {
//                if (e.data.cacheTask) {
//                    $$.currentTask = e.data.cacheTask;
//                    //$scope.highlightAllBlock(task);
//                }
//                if (e.data.currentTab) {
//                    $$.currentTab = e.data.currentTab;
//                }
//            });
//        });

//        kango.addMessageListener('getTaskList', function (e) {
//
//            $scope.$apply(function () {
//                $scope.taskList = e.data.taskList;
//                kango.console.log(e.data.taskList);
//                if (e.data.currentPage) {
//                    $scope.setPage(e.data.currentPage, e.data.currentTitle);
//                }
//                if (e.data.cacheTask) {
//                    var task = e.data.cacheTask;
//                    $scope.currentTask = clone(task);
//                    //$scope.currentTask = task;
//                    kango.console.log(e.data.fields);
//                    $scope.Fields = [];
//                    for (var f in e.data.fields) {
//                        $scope.Fields.push(e.data.fields[f]);
//                    }
//
//
//                    //$scope.highlightAllBlock(task);
//                }
//                if (e.data.currentIndex) {
//                    $scope.currentIndex = e.data.currentIndex;
//                }
//
//                if (e.data.currentTab) {
//                    $scope.currentTab = e.data.currentTab;
//                }
//
//                $scope.showTaskDetail = e.data.showTaskDetail;
//                kango.console.log('here' + $scope.showTaskDetail);
//            });
//        });

        //$scope.

        $$.setCurrentTask = function (task, index) {
            $$.currentTask = task;
            $$.currentIndex = index;
        };

        $$.setPage = function (page, title) {
            if (title) {
                $$.currentTitle = title;
            }
            $$.currentPage = page;
            //onResize();
        };

        $$.newTask = function () {
            $$.currentTask = new Task();
            $$.tempTask = new Task();
            $$.setPage('edit_task', '新增任務');
        };

        $$.editTask = function () {
            $$.tempTask = angular.copy($$.currentTask);
            //kango.console.log("copy: " + $$.tempTask);
            $$.setPage('edit_task', '編輯任務');
        };

        $scope.openModal = function (id, title, size) {

            var modalInstance = $modal.open({
                templateUrl: id,
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    task: function () {
                        return $scope.currentTask;
                    }
                }
            });

            modalInstance.result.then(function () {
                RemoteStorageService.remove($$.currentTask);
                remove($$.taskList, $$.currentTask);
                $$.currentTask = null;
            }, function () {

            });
        };

        $$.addGroup = function () {
            $$.currentTask.fields.push({
                name: "",
                type: "saveBlock",
                fields: [],
                manual: false,
                collapsed: false
            });
        };

        $$.addField = function (field) {
            var newField = {
                name: "",
                fields: [],
                saveText: true,
                manual: false,
                collapsed: false
            };

            if (field) {
                field.fields.push(newField);
                field.collapsed = false;
            }
            else {
                $$.currentTask.fields.push(newField);
            }
        };

        $$.selectFieldPath = function (scope, field) {
            if (scope.level === 0) {
                $$.fid = scope.$index;
                $$.fid2 = undefined;
            }
            else if (scope.level === 1) {
                kango.console.log(scope);
                $$.fid = scope.$parent.$index;
                $$.fid2 = scope.$index;
            }

            //var field = scope.field;
            if ($$.currentTab) {
                $$.currentTab.dispatchMessage('startBlockSelect', {type: field.type});
                $$.selecting = true;
            }

            if (!QueryString.popup) {
                KangoAPI.closeWindow();
            }
        };


        $$.generateFieldPath = function (field) {
            var pathes = [];
            for (var i = 0; i < field.fields.length; i++) {
                var path = field.fields[i].path;
                if (path !== undefined && path !== null && path !== "") {
                    pathes.push(path);
                }
            }
            if (pathes.length) {
                field.path = getCommonCSS(pathes);
            }
        };
        //kango.console.log("Str: "+getCommonCSS(["aa aa vvc", "aa aa vvc"]));

        $$.getShortCSS = function (path) {
            if (!path) return "";
            if (path.indexOf("#") > -1) {
                var tokens = path.split('#');
                path = '#' + tokens[tokens.length - 1];
            }
            return path;
        };

        $$.removeField = function (scope, field) {
            if (scope.level === 0) {
                remove($$.currentTask.fields, field);
            }
            else if (scope.level === 1) {
                kango.console.log(scope);
                var fid = scope.$parent.$parent.$parent.$index;
                remove($$.currentTask.fields[fid].fields, field);
            }
        };

        $$.backgroundColor = function (str) {
            if (!str || str.startsWith("_") || str == "") {
                return '#FFccFF';
            }
            return 'none';
        };


        $$.getDefaultNames = function () {
            return settings.selection.split('\n');
        };


        function saveCurrentTask() {
            var task = $$.currentTask;
            kango.console.log(task);
            if (task.id !== undefined && task.id !== null && task.id) {
                RemoteStorageService.update(task);
            }
            else {
                RemoteStorageService.create(task, function (taskID) {
                    task.id = taskID;
                    $$.$apply(function () {
                        $$.taskList.push(task);
                    });
                });
            }

        }


        function checkString(str) {
            if (!str || str.startsWith("_") || str == "") {
                return false;
            }
            return true;
        }

        $$.saveTask = function () {
            if ($$.currentTask) {
//                angular.forEach($scope.cacheTask.fields, function (field) {
//                    if (!field.name || field.name.startsWith("_") || field.name == "") { // || !field.path || field.path == "") {
//                        $scope.openCannotSaveModal('cannotSaveTaskPopup.html');
//                        return;
//                    }
//                });
                if (!$$.currentTask.sitetype || !$$.currentTask.channel || !$$.currentTask.sourcename) {
                    $$.openCannotSaveModal('cannotSaveTaskPopup.html');
                    return;
                }
                for (var i = 0; i < $$.currentTask.fields.length; i++) {


                    var field = $$.currentTask.fields[i];
                    if (!checkString(field.name)) { // || !field.path || field.path == "") {
                        $$.openCannotSaveModal('cannotSaveTaskPopup.html');
                        return;
                    }
                    for (var j = 0; j < field.fields.length; j++) {
                        if (!checkString(field.fields[j].name)) { // || !field.path || field.path == "") {
                            $$.openCannotSaveModal('cannotSaveTaskPopup.html');
                            return;
                        }
                    }

                    if (field.fields.length && !field.manual) {
                        $$.generateFieldPath(field)
                    }


                    field.css = $$.getShortCSS(field.path);
//                    if (field.index) {
//                        field.css+=':nth-of-type('+field.index+')';
//                    }
                    for (var j = 0; j < field.fields.length; j++) {
                        var sfield = field.fields[j];
                        sfield.css = $$.getShortCSS(sfield.path);
//                        if (sfield.index) {
//                            sfield.css+=':nth-of-type('+sfield.index+')';
//                        }

                    }
                    //field.css = $$.getShortCSS(field.path);

                }

                try {
                    testRegex($$.currentTask.targetPage);
                    testRegex($$.currentTask.linkPage);
                }
                catch (e) {
                    $$.openWrongRegexModal('wrongRegexPopup.html', e.message);
                    return;
                }
            }


            if (!$$.currentTask.id) {
                $$.currentIndex = $$.taskList.length;
            }

            $$.currentTask.baseURL = extractBaseURL($$.currentTask.rootURL);
            $$.setPage('view_task');
            saveCurrentTask();
        };

        $$.cancelTask = function () {
            if (equal($$.currentTask, $$.tempTask)) {
                if ($$.currentIndex == -1) {
                    $$.currentTask = null;
                }
                else {
                    $$.currentTask = angular.copy($$.tempTask);
                }
                $$.setPage('view_task');
            }
            else {
                $$.openCancelModal('cancelTaskPopup.html');
            }
        };

        $$.openCancelModal = function (id, title, size) {

            var modalInstance = $modal.open({
                templateUrl: id,
                controller: CancelInstanceCtrl,
                size: size,
                resolve: {
                    task: function () {
                        return $scope.currentTask;
                    }
                }
            });

            modalInstance.result.then(function () {
                if ($$.currentIndex == -1) {
                    $$.currentTask = null;
                }
                else {
                    $$.currentTask = angular.copy($$.tempTask);
                }
                $$.setPage('view_task');
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $$.openCannotSaveModal = function (id, title, size) {

            var modalInstance = $modal.open({
                templateUrl: id,
                controller: CannotSaveInstanceCtrl,
                size: size,
                resolve: {
                    task: function () {
                        return $scope.currentTask;
                    }
                }
            });
            modalInstance.result.then(function () {

            }, function () {

            });
        };


        $$.openWrongRegexModal = function (id, msg, title, size) {

            var modalInstance = $modal.open({
                templateUrl: id,
                controller: WrongRegexInstanceCtrl,
                size: size,
                resolve: {
                    task: function () {
                        return $scope.currentTask;
                    },
                    msg: function () {
                        return msg;
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () {

            });
        };

        $$.openTestFieldModal = function (field) {
            if (field.fields.length && !field.manual) {
                $$.generateFieldPath(field)
            }

            $$.highlightBlock(field);

            $$.currentTab.dispatchMessage('fieldContent', {fields: [field]});
        };


        $$.openAdjustFieldModal = function (field) {


            var modalInstance = $modal.open({
                templateUrl: "cssPopup.html",
                controller: AdjustFieldCtrl,
                size: 'lg',
                resolve: {
                    field: function () {
                        return field;
                    },
                    parent: function () {
                        return $$;
                    }
                }
            });
            $$.adjustField();

            modalInstance.result.then(function () {
                $$.removeHighlight();
            }, function () {
                $$.removeHighlight();
            });
        };

        kango.addMessageListener('getFieldContent', function (e) {
            $scope.createMessageModal('區塊預覽', e.data);
        });

        //RemoteStorageService.api('guessGroupsAndPatternsFromPage','https://www.google.com.tw/webhp?hl=zh-TW#newwindow=1&safe=off&hl=zh-TW&q=test',function (obj) {
        //    //$$.$apply(function () {
        //    //    $$.userName = obj.username;
        //    //
        //    //});
        //    kango.console.log(obj);
        //});

        $$.selectURL = function (isLink) {

            $$.currentTab.dispatchMessage('pageURL2', {isLink: isLink});
        };

        kango.addMessageListener('getPageURL2', function (e) {
            kango.console.log("here");
            var isLink = e.data.isLink;
            var urls = e.data.urls;
            kango.console.log(urls);
            var cUrls = [];
            var baseURL = extractBaseURL($scope.currentTask.rootURL);
            for (var i = 0; i < urls.length; i++) {
                if (urls[i] == null) continue;

                var base = extractBaseURL(urls[i]);
                //
                //if (base.startsWith('chrome')) {
                //    continue;
                //}
                //

                if (!base.startsWith('http')) {
                    //continue;
                    cUrls.push(baseURL + urls[i]);
                    //cUrls.push(urls[i]);
                }
                else {
                    cUrls.push(urls[i]);
                }
                //if(urls[i] != null)
                //    cUrls.push(urls[i]);
            }

            RemoteStorageService.api('guessGroupsAndPatterns', cUrls, function (dict) {
                //
                //    if(isLink){
                //        $scope.currentTask.linkPage=regex;
                //    }
                //    else{
                //        $scope.currentTask.targetPage=regex;
                //    }
                //});

                //kango.console.log('hi');
                //RemoteStorageService.api('guessGroupsAndPatternsFromPage', $$.currentTab.getUrl(), function (dict) {
                //var lists = $('<div>');

                //for (var key in urlDics) {
                //    lists.append($('<span>').text('群組: ' + key + ' '));
                //    var button = $('<button>');
                //    button.addClass("btn-small btn-info");
                //    button.text('選這組');
                //    button.attr('ng-click',"currentTask.linkPage ='" + key+ "';");
                //    lists.append(button);
                //    kango.console.log(lists);
                //
                //    var urls = urlDics[key];
                //    var list = $('<ul>');
                //    for (var i = 0; i < urls.length; i++) {
                //        var item = $('<li>').append(
                //            $('<a>')
                //                .text(urls[i])
                //                .attr('href', urls[i])
                //                .attr('target', '_blank'));
                //        list.append(item);
                //    }
                //    lists.append(list);
                //}
                //kango.console.log(urlDics);

                //$$.SelectURLCtrl('請選擇群組：', lists.html());
                var modalInstance = $modal.open({
                    templateUrl: "selectURL.html",
                    controller: SelectURLCtrl,
                    resolve: {
                        task: function () {
                            return $$.currentTask;
                        },
                        dict: function () {
                            return dict;
                        },
                        isLink: function () {
                            return isLink;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    //$$.removeHighlight();
                }, function () {
                    //$$.removeHighlight();
                });
            });

        });

        //$$.createMessageModal = function (title, content) {
        //    var modalInstance = $modal.open({
        //        templateUrl: "messagePopup.html",
        //        controller: MessageInstanceCtrl,
        //        resolve: {
        //            title: function () {
        //                return title;
        //            },
        //            content: function () {
        //                return $$.toTrusted(content);
        //            }
        //        }
        //    });
        //
        //    modalInstance.result.then(function () {
        //        $$.removeHighlight();
        //    }, function () {
        //        $$.removeHighlight();
        //    });
        //};


        $$.testUrl = function (re) {
            $$.currentTab.dispatchMessage('pageURL', {re: re});
        };


        kango.addMessageListener('getPageURL', function (e) {

            var urls = e.data.urls;
            var cUrls = [];
            var baseURL = extractBaseURL($scope.currentTask.rootURL);
            for (var i = 0; i < urls.length; i++) {
                var base = extractBaseURL(urls[i]);

                if (base.startsWith('chrome')) {
                    continue;
                }

                if (!base.startsWith('http')) {
                    //continue;
                    //cUrls.push(baseURL + urls[i]);
                }
                else {
                    cUrls.push(urls[i]);
                }
            }

            var input = {
                "op": "regexp_test",//"regexp_test_url",
                "re": e.data.re,
                "targets": cUrls//$$.currentTab.getUrl()
            };


            $.post(settings.server + '/api/', JSON.stringify(input), function (data) {
                var urls = JSON.parse(data);
                var list = $('<ul>');
                for (var i = 0; i < urls.length; i++) {
                    var item = $('<li>').append(
                        $('<a>')
                            .text(urls[i])
                            .attr('href', urls[i])
                            .attr('target', '_blank'));
                    list.append(item);
                }

                $$.createMessageModal('有效連結：', list.html());
            });
        });


        $$.createMessageModal = function (title, content) {
            var modalInstance = $modal.open({
                templateUrl: "messagePopup.html",
                controller: MessageInstanceCtrl,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return $$.toTrusted(content);
                    }
                }
            });

            modalInstance.result.then(function () {
                $$.removeHighlight();
            }, function () {
                $$.removeHighlight();
            });
        };

        $$.toTrusted = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };


        $$.openMonitorPage = function () {
            kango.browser.tabs.create({url: settings.server});
            if (!$$.popup) {
                KangoAPI.closeWindow();
            }
        };

        $$.openEditorPage = function () {
            window.open("popup.html?popup=1", "Test", "width=800, height=600");
            //kango.console.log(myWindow);
            //kango.browser.tabs.create({url: 'popup.html'});
            KangoAPI.closeWindow();
        };

        $$.openOptionPage = function () {
            $$.setPage('options', '參數設置');
            //window.open("popup.html?popup=1", "Test", "width=800, height=600");
            //kango.console.log(myWindow);
            //kango.browser.tabs.create({url: 'popup.html'});
            //KangoAPI.closeWindow();
        };

        $$.getMoniterURL = function () {
            return $sce.trustAsResourceUrl(settings.server);
        };

//        $('.colorPicker').livequery(function () {
//            $(this).colorPicker();
//        });


        $$.exportSettings = function (task) {
            var content = $('<div>');
            $('<textarea>')
                .text(JSON.stringify(task))
                .css({width: '100%', height: '100%'})
                .appendTo(content);
            $$.createMessageModal('任務設定：', content.html());
        };


        window.onunload = function () {

//            kango.dispatchMessage('cacheCurrentTask', {
//                cacheTask: $scope.currentTask,
//                fields: $scope.Fields
//            });
//            kango.dispatchMessage('saveState', {
//                currentIndex: $scope.currentIndex,
//                showTaskDetail: $scope.showTaskDetail
//            });
//            kango.console.log($scope.currentIndex);

        };

        function onResize() {
            $$.$apply(function () {
                $$.windowHeight = window.innerHeight;
            });
        }

        //document.addEventListener("DOMContentLoaded", onResize, false);
        window.onload = onResize;
        window.onresize = onResize;
        onResize();

/////////////////////// for tree
//
//
//        $scope.remove = function (scope) {
//            scope.remove();
//        };
//
//        $scope.newSubItem = function (scope) {
//            var nodeData = scope.$modelValue;
//            nodeData.fields.push({
//                name: "",
//                fields: []
//            });
//        };
//
//        $scope.visible = function (item) {
//            if ($scope.query && $scope.query.length > 0
//                && item.name.indexOf($scope.query) == -1) {
//                return false;
//            }
//            return true;
//        };
//
//        $scope.findNodes = function () {
//
//        };
//

//        $$.clickField = function (obj) {
//            kango.console.log(JSON.stringify(obj));
//        };

        //$$.newGroupName = "";
        //$scope.info = "";
        //$scope.groups = [];
//
//        $scope.$watch(function () {
//                return Groups.$getIndex();
//            },
//            function () {
//                $scope.groups = [];
//                var index = Groups.$getIndex();
//                if (index.length > 0) {
//                    for (var i = 0; i < index.length; i++) {
//                        var group = Groups[index[i]];
//                        if (group) {
//                            group.id = index[i];
//                            group.editing = false;
//                            if (!group.categories) {
//                                group.categories = [];
//                            }
//                            group.$firebase = $firebase(new Firebase(fbURL + group.id)); // jshint ignore:line
//                            group.destroy = function () {
//                                this.$firebase.$remove();
//                            };
//                            group.save = function () {
//                                this.$firebase.name = this.name;
//                                this.$firebase.sortOrder = this.sortOrder;
//                                this.$firebase.categories = this.categories;
//                                this.$firebase.$save();
//                                this.editing = false;
//                            };
//                            $scope.groups.push(group);
//                        }
//                    }
//                    $scope.groups.sort(function (group1, group2) {
//                        return group1.sortOrder - group2.sortOrder;
//                    });
//                }
//            }, true);


//        $scope.editGroup = function (group) {
//            group.editing = true;
//        };
//
//        $scope.cancelEditingGroup = function (group) {
//            group.editing = false;
//        };
//
//        $scope.saveGroup = function (group) {
//            group.editing = false;
//        };

//        $$.removeGroup = function (field) {
//            remove($$.currentTask.fields, field);
//        };

//        $scope.saveGroups = function () {
//            for (var i = $scope.groups.length - 1; i >= 0; i--) {
//                var group = $scope.groups[i];
//                group.sortOrder = i + 1;
//                //group.save();
//            }
//        };

//        $scope.addSubField = function (group) {
//            if (!group.newSubFieldName || group.newSubFieldName.length === 0) {
//                return;
//            }
//            group.fields.push({
//                name: group.newSubFieldName,
//                fields: []
////                id: Math.random(),
////                sortOrder: group.fields.length,
////                type: "category"
//            });
//            group.newSubFieldName = '';
//            //group.save();
//        };

//        $$.removeSubField = function (field, subField) {
////            if (window.confirm('Are you sure to remove this category?')) {
////                var index = group.categories.indexOf(category);
////                if (index > -1) {
////                    group.categories.splice(index, 1)[0];
////                }
////                group.save();
////            }
//            remove(field.fields, subField);
//        };

        $$.options = {
            dragMove: function (event) {
                //kango.console.log(event);
                if (window.event.ctrlKey) {
                    $(event.elements.placeholder).attr('copy', true);
                }
                else {
                    $(event.elements.placeholder).removeAttr('copy');
                }
            },

            accept: function (currentScope, targetScope, destIndex) {


                var source = currentScope.$modelValue;
                var level = targetScope.level;
                if (source.type === 'saveBlock' && level !== undefined) {
                    return false;
                }

                //kango.console.log(targetScope.field);


                if (level === undefined || (source.fields.length === 0 && targetScope.field.type === 'saveBlock')) {
                    return true;
                }
                //alert('不能把有子區塊的區塊當成子區塊！');
                return false;

//                kango.console.log(targetScope.level);
//                //var dest = destNode.$modelValue;
//                //source.type
//                //var destType = destNodes.$element.attr('data-type');
//                //return (data.type == destType); // only accept the same type
//                return true;
            },
//            dropped: function (event) {
//                kango.console.log(event);
//                var sourceNode = event.source.nodeScope;
//                var destNodes = event.dest.nodesScope;
//                // update changes to server
//                if (destNodes.isParent(sourceNode)
//                    && destNodes.$element.attr('data-type') == 'category') { // If it moves in the same group, then only update group
//                    var group = destNodes.$nodeScope.$modelValue;
//                    group.save();
//                } else { // save all
//                    $scope.saveGroups();
//                }
//            },
            beforeDrop: function (event) {
//                if (!window.confirm('Are you sure you want to drop it here?')) {
//                    event.source.nodeScope.$$apply = false;
//                }
                //kango.console.log(event);
                if (window.event.ctrlKey) {
                    var field = angular.copy(event.source.nodeScope.$modelValue);
                    var array = event.source.nodesScope.$modelValue;
                    array.splice(event.source.index, 0, field);
                }
                //kango.console.log(d3.event);
            }

        };


        $$.adjustField = function () {
            if ($$.currentTab) {
                kango.console.log("Start get dom tree!");
                $$.currentTab.dispatchMessage('getDomTree', '');
            }
        };


        $$.getTestResult = function (field) {
            var regs = field.regs;
            var result = field.testStr;

            if (!result)return "請輸入測試字串！";
            //console.log(scope.regex);

            try {
                for (var i = 0; i < regs.length; i++) {
                    var reg = new RegExp(regs[i].regex, "gm");
                    result = result.replace(reg, regs[i].replacement.replace(/\\([0-9]+)/g, "$$1"));
                }
            }
            catch (e) {
                return "正規表示式錯誤！";
            }


            //return reg.exec(scope.testStr);
            return result;
        };

        $$.newReg = function (field) {
            if (!field.regs) {
                field.regs = [];
            }
            field.regs.push({
                regex: "",
                replacement: ""
            });
        };

        $$.removeRegex = function (regs, reg) {
            remove(regs, reg);
        };

        var tempField;
        $$.getTestString = function (field) {
            tempField = field;
            if ($$.currentTab) {
                $$.currentTab.dispatchMessage('fieldPreview', {field: field});
            }
        };

        kango.addMessageListener('getFieldPreview', function (e) {
            $$.$apply(function () {
                tempField.testStr = e.data;
            });
        });

        $$.regOptions = {
            axis: "y",
            placeholder: "well"
        };
    });
}]);

//
//app.directive('compile', ['$compile', function ($compile) {
//    return function ($scope, $element, $attrs) {
//        var ensureCompileRunsOnce = $scope.$watch(
//            function ($scope) {
//                // watch the 'compile' expression for changes
//                return $scope.$eval($attrs.compile);
//            },
//            function (value) {
//                // when the 'compile' expression changes
//                // assign it into the current DOM
//                $element.html(value);
//
//                // compile the new DOM and link it to the current
//                // scope.
//                // NOTE: we only compile .childNodes so that
//                // we don't get into infinite loop compiling ourselves
//                $compile($element.contents())($scope);
//
//                // Use un-watch feature to ensure compilation happens only once.
//                ensureCompileRunsOnce();
//            }
//        );
//    };
//}]);

//
//app.directive('mySortable', function () {
//    return {
//        link: function (scope, el, attrs) {
//            el.sortable({
//                revert: true
//            });
//            el.disableSelection();
//
//            el.on("sortdeactivate", function (event, ui) {
//                var from = angular.element(ui.item).scope().$index;
//                var to = el.children().index(ui.item);
//                if (to >= 0) {
//                    scope.$apply(function () {
//                        if (from >= 0) {
//                            scope.$emit('my-sorted', {from: from, to: to});
//                        } else {
//                            scope.$emit('my-created', {to: to, name: ui.item.text()});
//                            ui.item.remove();
//                        }
//                    })
//                }
//            });
//        }
//    }
//});
//
//app.directive('myDraggable', function () {
//
//    return {
//        link: function (scope, el, attrs) {
//            el.draggable({
//                connectToSortable: attrs.myDraggable,
//                helper: "clone",
//                revert: "invalid"
//            });
//            el.disableSelection();
//        }
//    }
//
//});

function Task() {
    this.id = null;
    this.name = "";

    this.fields = [];
    this.state = 'stop';
    this.baseURL = "";
    this.rootURL = "";

    this.linkPage = "";
    this.targetPage = "";
}


var ModalInstanceCtrl = function ($scope, $modalInstance, task) {
    $scope.currentTask = task;

    $scope.removeTask = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var SelectURLCtrl = function ($scope, $modalInstance, task, dict, isLink) {
    $scope.currentTask = task;
    $scope.dict = dict;
    //$score.data={};
    //
    //$score.data.selectList=[];
    $scope.selectList = [];

    var keys = [];
    for (var k in dict) {
        keys.push(k);
    }

    $scope.setKey = function (key) {
        if (isLink) {
            $scope.currentTask.linkPage = key;
        }
        else {
            $scope.currentTask.targetPage = key;
        }
        $modalInstance.close();
    };

    $scope.ok = function () {
        $modalInstance.close();
        //var links = [];
        //for(var i=0;i< $scope.selectList.length; i++){
        //    if($scope.selectList[i]){
        //        links=links.concat(dict[keys[i]]);
        //
        //    }
        //}

        var regs = [];
        for (var i = 0; i < $scope.selectList.length; i++) {
            if ($scope.selectList[i]) {
                //links = links.concat(dict[keys[i]]);
                regs.push("(" + keys[i] + ")");

            }
        }
        if (isLink) {
            $scope.currentTask.linkPage = regs.join("|");
        }
        else {
            $scope.currentTask.targetPage = regs.join("|");
        }

        //RemoteStorageService.api('guessGroupPattern', links, function (regex) {
        //
        //    if(isLink){
        //        $scope.currentTask.linkPage=regex;
        //    }
        //    else{
        //        $scope.currentTask.targetPage=regex;
        //    }
        //});
        //alert($scope.selectList);


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var CancelInstanceCtrl = function ($scope, $modalInstance, task) {

    $scope.currentTask = task;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var CannotSaveInstanceCtrl = function ($scope, $modalInstance, task) {
    $scope.currentTask = task;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var AdjustFieldCtrl = function ($scope, $modalInstance, field, parent) {

    $scope.parent = parent;

    kango.addMessageListener('domTree', function (e) {
        $scope.$apply(function () {
            $scope.root = e.data.tree;
            $scope.field = field;
        });
    });

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var WrongRegexInstanceCtrl = function ($scope, $modalInstance, task, msg) {
    $scope.currentTask = task;
    $scope.msg = msg;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var MessageInstanceCtrl = function ($scope, $modalInstance, title, content) {
    //$scope.currentTask = task;
    $scope.title = title;
    $scope.content = content;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
