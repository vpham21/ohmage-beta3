var TouchEnabledItemModel = function(item, highlightItem, onTouchCallback){
    var self = {};
    
    var onTouchHighlightClass = "pressed";
    
    var onTouchCallbackList = [];
    
    var invokeOnTouchCallbacks = function(){
        for(var i = 0; i < onTouchCallbackList.length; i++){
            if(typeof(onTouchCallbackList[i]) === "function"){
                onTouchCallbackList[i](item);
            }
        }
    };
    
    var bindClickEvents = function(){
        $(item).click(function(){
            invokeOnTouchCallbacks();
        });
    };
    
    var bindTouchEvents = function(){
        $(item).bind("touchmove", function(e){
            var item = e.srcElement;
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var elm = $(item).offset();
            var x = touch.pageX - elm.left;
            var y = touch.pageY - elm.top;
            if((x < $(item).width() && x > 0) && (y < $(item).height() && y > 0)){
                $(highlightItem).addClass(onTouchHighlightClass);
            }else{
                $(highlightItem).removeClass(onTouchHighlightClass);
            }
        });
        
        $(item).bind("touchstart", function(){
            $(highlightItem).addClass(onTouchHighlightClass);
        });
            
        $(item).bind("touchend", function(){
            if($(highlightItem).is(onTouchHighlightClass)){
                invokeOnTouchCallbacks();
                $(highlightItem).removeClass(onTouchHighlightClass);
            }
        });
    };
    
    self.setOnTouchHighlightClass = function(newOnTouchHighlightClass){
        onTouchHighlightClass = newOnTouchHighlightClass;
    };
    
    self.bindTouchCallback = function(onTouchCallback){
        if(typeof(onTouchCallback) !== "undefined"){
            onTouchCallbackList.push(onTouchCallback);
        }
    };
    
    //Initialization.
    (function(){
        
        if(DeviceDetection.isOnDevice()){
            bindTouchEvents();
        }else{
            bindClickEvents();
        }
        
        self.bindTouchCallback(onTouchCallback);        
    }());
    
    return self;

};

TouchEnabledItemModel.bindTouchEvent = function(item, onTouchCallback){
    new TouchEnabledModel(item, item, onTouchCallback);
};
