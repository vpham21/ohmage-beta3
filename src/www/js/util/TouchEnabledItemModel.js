/**
 * 
 * @author Zorayr Khalapyan
 * @version 8/9/2012
 */
var TouchEnabledItemModel = (function(){
    var self = {};
    
    self.bindClickEvent = function(item, onClickCallback){
        if(typeof(onClickCallback) === "function"){
            $(item).click(onClickCallback);    
        }
    };
    
    self.bindTouchEvents = function(item, highlightItem, onTouchCallback, onTouchHighlightClass){
        
        highlightItem = highlightItem || item;
        onTouchHighlightClass = onTouchHighlightClass || "pressed";
    
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
            if($(highlightItem).is("." + onTouchHighlightClass)){
                $(highlightItem).removeClass(onTouchHighlightClass);
                if(typeof(onTouchCallback) === "function"){ onTouchCallback(); }
            }
        });
    };
    
    self.bindTouchEvent = function(item, highlightItem, onTouchCallback, onTouchHighlightClass){
        if(DeviceDetection.isOnDevice()){
            self.bindTouchEvents(item, highlightItem, onTouchCallback, onTouchHighlightClass);
        }else{
            self.bindClickEvent(item, onTouchCallback);
        }
    };

    return self;
}());
