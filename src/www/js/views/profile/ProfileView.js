var ProfileView = function( ) {
    
    var that = {};
    
    that.changePasswordHandler = function() {};
    
    that.clearCustomizedChoicesHandler = function() {};
    
    that.logoutAndClearDataHandler = function() {};
    
    that.render = function() {
        var menu = mwf.decorator.Menu(auth.getUsername());
        
        var changePasswordMenuItem = menu.addMenuLinkItem('Change Password', null, 'Easily change your password.');
        TouchEnabledItemModel.bindTouchEvent(changePasswordMenuItem, changePasswordMenuItem, that.changePasswordHandler, "menu-highlight");
        var clearCustomChoicesMenuItem = menu.addMenuLinkItem('Clear Customized Choices', null, "Erase any saved custom choices.");
        TouchEnabledItemModel.bindTouchEvent(clearCustomChoicesMenuItem, clearCustomChoicesMenuItem, that.clearCustomizedChoicesHandler, "menu-highlight");
        var logoutMenuItem = menu.addMenuLinkItem('Logout and Clear Data', null, "When you logout, all the data stored on the phone will be completely erased.");
        TouchEnabledItemModel.bindTouchEvent(logoutMenuItem, logoutMenuItem, that.logoutAndClearDataHandler, "menu-highlight");
        return menu;
    };
    
    return that;
};