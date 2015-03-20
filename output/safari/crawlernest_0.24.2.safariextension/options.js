/**
 * Created by Tim on 2014/5/8.
 */



KangoAPI.onReady(function() {
    bindTextInput('server');



    //bindTextInput('color');

    bindTextInput('selection');

    //bindCheckBoxInput('offline');


});


function bindTextInput(id){
    var input=$('#'+id);
    input.val(settings[id]);
    input.on('input',function(){
        settings[id]=input.val();
    });
}

function bindCheckBoxInput(id){
    var input=$('#'+id);
    kango.console.log(settings[id]);
    input.prop('checked',settings[id]);
    input.change(function(){
        settings[id]=input.is(':checked');
    });
}

