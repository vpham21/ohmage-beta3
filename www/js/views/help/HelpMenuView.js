/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var HelpMenuView = function (sections) {
    "use strict";
    var that = AbstractView();

    that.helpSectionClickedCallback = function (helpSectionIndex) {};

    var openHelpSectionCallbackClosure = function (helpSectionIndex) {
        return function () {
            that.helpSectionClickedCallback(helpSectionIndex);
        };
    };

    that.render = function () {
        var menu = mwf.decorator.Menu('Help Menu'),
            menuItem,
            i,
            numSections = sections.length;
        for (i = 0; i < numSections; i += 1) {
            menuItem = menu.addMenuLinkItem(sections[i].title);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, openHelpSectionCallbackClosure(i), "menu-highlight");
        }
        return menu;
    };
    return that;
};
