var UploadQueue = function()
{
    var mwfd = mwf.decorator;

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var me = this;

    var renderSummaryView = function(survey, response, container){

        var summaryViewContainer = document.createElement('div');

        survey.render(summaryViewContainer, false);

        var displayUploadQueue = function(){
            container.removeChild(summaryViewContainer);
            me.renderUploadQueue(container);
        }

        var uploadSurvey = mwfd.SingleClickButton('Upload Survey', function() {

            var uploader = new SurveyResponseUploader(survey, response);

            uploader.upload(function(response){
                console.log(response);

                if(response.result === "success"){
                    displayUploadQueue();
                }

            });
        });

        summaryViewContainer.appendChild(uploadSurvey);


        mwfd.TopButton("Upload Queue", null, function(){
            displayUploadQueue();
        }, true);

        container.appendChild(summaryViewContainer);

    };

    this.renderUploadQueue = function(container)
    {
        mwfd.TopButton("All Campaigns", null, function(){
             openCampaignsView();
        }, true);

        var title = 'Pending Uploads';

        var pool = SurveyResponse.getPool();
        var queueMenu = mwfd.Menu(title);


        for(var uuid in pool){

            //Restore the survey response object.
            var response = SurveyResponse.restoreSurvey(uuid);

            //Skip survey responses that were not completed.
            if(!response.isSubmitted()){
                continue;
            }

            Survey.init(response.getCampaignURN(), response.getSurveyID(), function(survey){

                var details = "Submitted on " + response.getSubmitDate() + ".";
                var menuItem = queueMenu.addMenuLinkItem(survey.getTitle(), null, details);

                menuItem.onclick = function(){
                    container.removeChild(queueMenu);
                    renderSummaryView(survey, response, container);
                };

            });

        }

    if(queueMenu.size() === 0){
        var emptyQueue = mwfd.Content(title);
        emptyQueue.addTextBlock('Upload queue is empty.');
        container.appendChild(emptyQueue);
    }
    else{
        container.appendChild(queueMenu);
    }



    };
};
