/**
 * @class TouchEnabledModel
 * @author Zorayr Khalapyan
 * @version 8/9/2012
 */
var TouchEnabledItemModel = (function(){
    var self = {};
    
    self.bindClickEvents = function(item, highlightItem, onClickCallback, onMouseoverHighlightClass){
        if(typeof(onClickCallback) === "function"){
            $(item).mouseover(function(){
                $(highlightItem).addClass(onMouseoverHighlightClass);
            }).mouseout(function(){
                $(highlightItem).removeClass(onMouseoverHighlightClass);
            }).click(onClickCallback);    
        }
    };
    
    self.bindTouchEvents = function(item, highlightItem, onTouchCallback, onTouchHighlightClass){
        
        self.bindClickEvents(item, function(){return false;});
        
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
            
        $(item).bind("touchend", function(e){
            if($(highlightItem).is("." + onTouchHighlightClass)){
                $(highlightItem).removeClass(onTouchHighlightClass);
                if(typeof(onTouchCallback) === "function"){ onTouchCallback(e); }
            }
        });
    };
    
    self.bindTouchEvent = function(item, highlightItem, onTouchCallback, highlightClass){
        highlightItem = highlightItem || item;
        highlightClass = highlightClass || "pressed";        
        if(DeviceDetection.isOnDevice()){
            self.bindTouchEvents(item, highlightItem, onTouchCallback, highlightClass);
        }else{
            self.bindClickEvents(item, highlightItem, onTouchCallback, highlightClass);
        }
    };

    return self;
}());
