var LocalNotificationAdapter = (function(){
  
    var self = this;
    
    var isLocalNotificationAvailable = function(){
        return typeof plugins !== "undefined" && typeof(plugins.localNotification) !== "undefined";
    };
    
    self.add = function(options){
        if (isLocalNotificationAvailable()) {
            if(isDeviceAndroid()){
                plugins.localNotification.add({
                    date        : options.date,
                    message     : options.message,
                    ticker      : options.ticker,
                    repeatDaily : options.repeatDaily,
                    id          : options.id
                });
            }else if(isDeviceiOS()){
                plugins.localNotification.add({
                    date        : options.date,
                    message     : options.message,
                    hasAction   : false,
                    badge       : 1,
                    id          : options.id,
                    sound       :'horn.caf'
                });
            }
        }
    };
    
    self.cancel = function(id){
        if (isLocalNotificationAvailable()) {
            plugins.localNotification.cancel(id);
        }
    };
    
    self.cancelAll = function(){
        if (isLocalNotificationAvailable()) {
            plugins.localNotification.cancelAll();
        }
    };
    
    return self;
})();