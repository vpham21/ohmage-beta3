/**
 * @author Zorayr Khalapyan
 * @version 4/4/13
 * @constructor
 */
var DashboardModel = function () {
    "use strict";

    var that = {};

    /**
     * Stores a list of dashboard items. The key of the object is used in a
     * switch statement to open a page or do some action according to the user's
     * pressed item. The reason why these are stored in an object as opposed to
     * an array is that the labels may change i.e. instead of "Campaigns" have
     * "Tasks", but the page names have to remain the same.
     */
    var dashboardItems = {
        "campaigns" : "Campaigns",
        "surveys"   : "Surveys",
        "queue"     : "Queue",
        "profile"   : "Profile",
        "help"      : "Help",
        "reminders" : "Reminders"
    };

    /**
     * Returns an object representing the items displayed on the dashboard.
     * @returns {{campaigns: string, surveys: string, queue: string, profile: string, help: string, reminders: string}}
     */
    that.getDashboardItems = function () {
        //Update the queue dashboard icon label with the number of pending
        //uploads.
        var queueSize = SurveyResponseStoreModel.getUploadQueueSize(),
            queueLabel = "Queue (" + queueSize + ")";
        dashboardItems.queue = queueLabel;

        return dashboardItems;
    };

    return that;
};