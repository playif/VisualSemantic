
function getOrDefault(name,defaultValue){
    var value=kango.storage.getItem(name);
    if(value === null){
        return defaultValue;
    }
    return value;
}

function bindProperity(obj,name,defaultValue){
    Object.defineProperty(obj, name, {
        set: function(value){
            kango.storage.setItem(name,value);
        },
        get: function(){
            return getOrDefault(name,defaultValue);
        }
    });
}

var settings={};
//bindProperity(settings,'server','http://220.134.108.206:8002/api/');
bindProperity(settings,'server','http://220.134.108.206:8002');

bindProperity(settings,'color','#FFccFF');

bindProperity(settings,'offline',false);

bindProperity(settings,'selection',
    "Author\nPicture\nPublish Date\nDay of Week\n\
Topic\nContent\nURL\nType\nFlag\nPositive Emotion\n\
Negative Emotion\nCriticize\nAppendix");

