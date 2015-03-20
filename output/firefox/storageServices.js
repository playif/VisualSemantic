/**
 * Created by Tim on 2014/5/8.
 */

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
}

var LocalStorageService = {
    taskNum: 'task_number',

    read: function (cb) {
        var list = [];
        if (kango.storage.getItem(this.taskNum)) {
            var keys = kango.storage.getKeys();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];

                if (key.startsWith('tid')) {
                    list.push(kango.storage.getItem(key));
                }
            }
        }
        cb(list);
    },

    create: function (task, cb) {
//        kango.console.log("creating");
//        kango.console.log(kango.storage.getItem("tid-" + task.id));
        if (!kango.storage.getItem(this.taskNum)) {
            kango.storage.setItem(this.taskNum, 0);
        }
        //kango.console.log(kango.storage.getItem(this.taskNum));
        var taskID = kango.storage.getItem(this.taskNum) + 1;
        kango.storage.setItem(this.taskNum, taskID);
        cb(taskID);

        kango.storage.setItem("tid-" + taskID, task);
    },

    remove: function (task) {
        //kango.console.log("removing");
        //kango.console.log(kango.storage.getItem("tid-" + task.id));
        //kango.storage.clear();
        kango.storage.removeItem("tid-" + task.id);
    },

    update: function (task) {
        //kango.console.log("updating");
        //kango.console.log("tid-" + task.id);
        kango.storage.setItem("tid-" + task.id, task);
    }
};


var RemoteStorageService = {
    fail:function(){
        alert('你設定的伺服器沒有回應，可能是伺服器設定錯誤，請從選項設定server欄位！');
        kango.dispatchMessage('closePopup', '');
        kango.browser.tabs.create({url: 'options.html', focused: true});
    },

    read: function (cb) {
        var me=this;
        //kango.console.log(settings.server);
        //console.log(settings.server);
        try {
            $.post(settings.server + '/api', JSON.stringify({op: 'read'}), function (data) {
                //kango.console.log('here');
                //console.log(data);
                cb(JSON.parse(data));
            }).error(function (e) {
                //alert('你設定的伺服器沒有回應，請從選項設定server欄位！');
                console.log('fail');
//                me.fail();
                //cb([]);
            });
        } catch (e) {
            this.fail();
        }
//.error(function (e) {
//            alert('你設定的伺服器沒有回應，請從選項設定server欄位！');
//            console.log('fail');
//            cb([]);
//        }).always(function () {
//            alert("finished");
//            console.log('ａｌｗａｙｓ');
//        });
//        console.log('ａｌｗａｙｓ');
//        alert("finished");
    },

    user: function (cb){
        var me=this;
        //console.log(settings.server);
        try {
            $.post(settings.server + '/api', JSON.stringify({op: 'user'}), function (data) {
                //console.log(data);
                cb(JSON.parse(data));
            }).error(function (e) {
                //alert('你設定的伺服器沒有回應，請從選項設定server欄位！');
                console.log('fail');
//                me.fail();
                //cb([]);
            });
        } catch (e) {
            this.fail();
        }
    },

    // For other APIs
    api: function (op,args,cb){
        var me=this;
        kango.console.log(args);
        //console.log(settings.server);
        try {
            $.post(settings.server + '/api', JSON.stringify({op: op, args:args}), function (data) {
                kango.console.log(data);
                cb(JSON.parse(data));
            }).error(function (e) {
                //alert('你設定的伺服器沒有回應，請從選項設定server欄位！');
                console.log('fail');
//                me.fail();
                //cb([]);
            });
        } catch (e) {
            this.fail();
        }
    },

    create: function (task, cb) {
        //console.log(JSON.stringify({op: 'create', task: task}));
        $.post(settings.server + '/api', JSON.stringify({op: 'create', task: task}), cb);
    },

    remove: function (task) {
        //console.log(JSON.stringify({op: 'remove', task: task}));
        $.post(settings.server + '/api', JSON.stringify({op: 'delete', id: task.id}));
    },

    update: function (task) {
        //console.log(JSON.stringify({op: 'update', task: task}));
        $.post(settings.server + '/api', JSON.stringify({op: 'update', task: task}));
    }
};