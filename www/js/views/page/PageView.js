/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

var PageView = function (pageModel) {
    "use strict";
    var that = {};

    /**
     * DOM fragments for storing the header, the main view, and the footer of
     * the current page.
     */
    var header, view, footer;

    var headerTitle = document.getElementById("header-title");
    var homeLink = document.getElementById("header-home-icon");
    var privacyLink = document.getElementById("footer-privacy-link");

    that.render = function () {
        var title;
        mwf.decorator.TopButton(pageModel.getTopButtonName(), null, pageModel.getTopButtonCallback(), true);

        // Truncate title to 25 characters with '...' if the title is over 25 characters.
        title = pageModel.getPageTitle();
        if (title.length > 25) {
            title = title.substring(0, 25) + "...";
        }

        headerTitle.innerHTML = title;
        homeLink.onclick = PageController.goToRootPage;
        privacyLink.onclick = function () {
            PageController.openPrivacy();
        };

        var renderedView = pageModel.getView().render(),
            containerDiv = document.createElement('div');
        containerDiv.appendChild(renderedView);

        if (pageModel.getNavigationButtonLabel()) {
            containerDiv.appendChild(mwf.decorator.SingleClickButton(pageModel.getNavigationButtonLabel(), pageModel.getNavigationButtonCallback()));
        }

        return containerDiv;
    };

    return that;
};