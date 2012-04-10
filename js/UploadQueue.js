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
    var renderSummaryView = function(survey, surveyResponse, container){

        container.innerHTML = "";

        var summaryViewContainer = document.createElement('div');

        survey.render(summaryViewContainer, false);

        //Kind of a back button that removes the current survey, and restores
        //the original upload queue view.
        var displayUploadQueue = function(){
            container.removeChild(summaryViewContainer);
            me.renderUploadQueue(container);
        }

        //Button callback that will initial a survey response upload. If the
        //upload is successful, then a message is displayed to the user and then
        //the entire queue is displayed. If unsuccessful, an error message is
        //displayed and the user has the option to retry.
        var uploadSurveyResponse = function() {

            //The upload assembles the data from the survey and the survey
            //response and is responsible for making an API call.
            var uploader = new SurveyResponseUploader(survey, surveyResponse);

            //Start the upload process.
            uploader.upload(function(response){

                if(response.result === "success"){

                    alert("Successfully uploaded your survey response.");
                    SurveyResponse.deleteSurvey(surveyResponse);
                    displayUploadQueue();

                }else{

                    alert(response.errors[0].text);

                }

            });
        };

        //Button handler for deleting an individual survey response. The user
        //will be prompted for confirmation before deleting the survey response.
        var deleteSurveyResponse = function(){

            var response = confirm("Are you sure you would like to delete your response?");
            if(response){
                SurveyResponse.deleteSurvey(surveyResponse);
                displayUploadQueue();
            }
        }

        summaryViewContainer.appendChild(mwfd.DoubleClickButton("Delete", deleteSurveyResponse, "Upload Survey", uploadSurveyResponse));

        mwfd.TopButton("Upload Queue", null, function(){
            displayUploadQueue();
        }, true);

        container.appendChild(summaryViewContainer);

    };

    this.renderUploadQueue = function(container){

        container.innerHTML = "";

        mwfd.TopButton("All Campaigns", null, function(){
             PageNavigation.openCampaignsView();
        }, true);

        var title = 'Pending Uploads';

        var pendingResponses = SurveyResponse.getPendingResponses();
        var queueMenu = mwfd.Menu(title);

        for(var uuid in pendingResponses){

            var survey   = pendingResponses[uuid].survey;
            var response = pendingResponses[uuid].response;

            var details = "Submitted on " + response.getSubmitDate() + ".";
            var menuItem = queueMenu.addMenuLinkItem(survey.getTitle(), null, details);

            menuItem.onclick = function(){
                renderSummaryView(survey, response, container);
            };

        }

        //Handle queus that have at least one element.
        if(queueMenu.size() > 0){

            //Delete all button click handler.
            var deleteAll = function(){
                var response = confirm("Are you sure you would like to delete all your responses?");
                if(response){
                    for(var uuid in pendingResponses){
                        SurveyResponse.deleteSurvey(pendingResponses[uuid].response);
                    }
                    renderUploadQueue();
                }
            };
            //Upload all button click handler.
            var uploadAll = function(){
                SurveyResponseUploader.uploadAll(pendingResponses, function(count){

                    if(count == 0){
                        alert("Unable to upload any surveys at this time.");
                    }else{
                        alert("Successfully uploaded " + count + " survey(s).");
                    }

                    renderUploadQueue();

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

            //Display a back button.
            container.appendChild(mwfd.SingleClickButton("Back to Campaigns", function(){
                PageNavigation.openCampaignsView();

            }));
        }



    };
};
