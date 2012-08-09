var UploadQueue = function()
{
    var mwfd = mwf.decorator;

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var me = this;

    /**
     * Renders a summary of a single survey response.
     */
    var renderResponseView = function(survey, surveyResponse, container){

        container.innerHTML = "";

        var responseViewContainer = document.createElement('div');

        survey.render(responseViewContainer, false);

        //Kind of a back button that removes the current survey, and restores
        //the original upload queue view.
        var displayUploadQueue = function(){
            container.removeChild(responseViewContainer);
            me.renderUploadQueue(container);
        }

        //Button callback that will initialize a survey response upload. If the
        //upload is successful, then a message is displayed to the user and then
        //the entire queue is displayed. If unsuccessful, an error message is
        //displayed and the user has the option to retry.
        var uploadSurveyResponse = function() {

            var onSuccess = function(response){
                showMessage("Successfully uploaded your survey response.", function(){
                    SurveyResponse.deleteSurveyResponse(surveyResponse);
                    displayUploadQueue();
                });
            };
            
            var onError = function(error){
                showMessage("Unable to upload survey response at this time. Please try again later.");
            };
            
            //Start the upload process.
            (new SurveyResponseUploader(survey, surveyResponse)).upload(onSuccess, onError);
        };

        //Button handler for deleting an individual survey response. The user
        //will be prompted for confirmation before deleting the survey response.
        var deleteSurveyResponse = function(){

            var message = "Are you sure you would like to delete your response?";

            showConfirm(message, function(yes){
                if(yes){
                    SurveyResponse.deleteSurveyResponse(surveyResponse);
                    displayUploadQueue();
                }
            }, "Yes,No");

        }

        responseViewContainer.appendChild(mwfd.DoubleClickButton("Delete", deleteSurveyResponse, "Upload", uploadSurveyResponse));

        var viewSummaryButton = mwfd.SingleClickButton("View Summary", function(){
            responseViewContainer.removeChild(viewSummaryButton);

            var hideSummary = function(){

                responseViewContainer.removeChild(hideSummaryButtonTop);
                responseViewContainer.removeChild(summaryView);
                responseViewContainer.removeChild(hideSummaryButtonBottom);

                responseViewContainer.appendChild(viewSummaryButton);
            };

            var hideSummaryButtonTop = mwfd.SingleClickButton("Hide Summary", hideSummary);
            responseViewContainer.appendChild(hideSummaryButtonTop);

            var summaryView = surveyResponse.render();
            responseViewContainer.appendChild(summaryView);


            var hideSummaryButtonBottom = mwfd.SingleClickButton("Hide Summary", hideSummary);
            responseViewContainer.appendChild(hideSummaryButtonBottom);

        });

        responseViewContainer.appendChild(viewSummaryButton);

        mwfd.TopButton("Upload Queue", null, function(){
            displayUploadQueue();
        }, true);

        container.appendChild(responseViewContainer);

    };

    this.renderUploadQueue = function(container){

        container.innerHTML = "";

        mwfd.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);

        var title = "Pending Uploads";
        var pendingResponses = SurveyResponse.getPendingResponses();
        var queueMenu = mwfd.Menu(title);

        var callback = function(survey, response){
            return function(){
                renderResponseView(survey, response, container);
            };
        };

        for(var uuid in pendingResponses){
            var survey   = pendingResponses[uuid].survey;
            var response = pendingResponses[uuid].response;

            var details = "Submitted on " + response.getSubmitDate() + ".";
            var menuItem = queueMenu.addMenuLinkItem(survey.getTitle(), null, details);

            menuItem.onclick = callback(survey, response);
        }

        //Handle queus that have at least one element.
        if(queueMenu.size() > 0){

            //Delete all button click handler.
            var deleteAll = function(){

                var message = "Are you sure you would like to delete all your responses?";
                var buttonLabels = 'Yes,No';

                var callback = function(yes){
                    if(yes){
                        for(var uuid in pendingResponses){
                            SurveyResponse.deleteSurveyResponse(pendingResponses[uuid].response);
                        }
                        me.renderUploadQueue(container);
                    }
                };

                showConfirm(message, callback, buttonLabels);

            };

            //Upload all button click handler.
            var uploadAll = function(){
                SurveyResponseUploader.uploadAll(pendingResponses, function(count){
                    
                    var message = (count == 0)? "Unable to upload any surveys at this time." :
                                                "Successfully uploaded " + count + " survey(s).";

                    showMessage(message, function(){
                        me.renderUploadQueue(container);
                    });

                });
            };

            //Add the queued surveys menu.
            container.appendChild(queueMenu);

            //Add delete all and upload all buttons. The handlers are defined above.
            container.appendChild(mwfd.DoubleClickButton("Delete All", deleteAll, "Upload All", uploadAll));


        //Handle empty queues.
        } else {

            var emptyQueue = mwfd.Content(title);
            emptyQueue.addTextBlock('Upload queue is empty.');
            
            container.appendChild(emptyQueue);
            container.appendChild(mwfd.SingleClickButton("Back to Campaigns", PageNavigation.openInstalledCampaignsView));
        }

    };
};
