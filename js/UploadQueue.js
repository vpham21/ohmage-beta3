var UploadQueue = function()
{
    var mwfd = mwf.decorator;

    this.renderUploadQueue = function(container)
    {
        var title = 'Pending Uploads';

        var pool = SurveyResponse.getPool();
        var queueMenu = mwfd.Menu(title);
        
        var addSurveyToMenu = function(survey)
        {
            var displayDate = (new Date(surveyResponse.time)).toString().substr(0, 24);
            var details = "Submitted on " + displayDate + ".";

            queueMenu.addMenuLinkItem(survey.getTitle(), null, details);
        };
        
        for(var uuid in pool){

            //Skip survey responses that were not completed.
            if(pool[uuid].submitted){
                Survey.init(pool[uuid].campaign_urn, pool[uuid].survey_id, addSurveyToMenu);
            }

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
