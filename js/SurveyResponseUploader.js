function SurveyResponseUploader(survey, surveyResponse){

    var auth = new UserAuthentication();

    var createTextInput = function(name, value){

        var input = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.value = value;

        return input;

    };

    //Append a hidden iframe for doing asynchronous form uploads.
    if(!document.getElementById('upload-frame')){
        var frame = document.createElement('iframe');
        frame.id = 'upload-frame';
        frame.name = 'upload-frame';
        frame.style.width = '100%';
        //frame.style.display = 'none';
        document.body.appendChild(frame);
    }
    console.log(getSurveyUploadProxyURL());

    //Initialize the upload form.
    var form = document.createElement('form');
    form.action = getSurveyUploadProxyURL();
    form.method = 'POST';
    form.enctype = 'multipart/form-data';
    form.target = 'upload-frame';


    //Add the necesssary form input elements.
    form.appendChild(createTextInput('campaign_urn', surveyResponse.getCampaignURN()));
    form.appendChild(createTextInput('campaign_creation_timestamp', survey.getCampaign().getCreationTimestamp()));
    form.appendChild(createTextInput('user', auth.getUsername()));
    form.appendChild(createTextInput('password', auth.getHashedPassword()));
    form.appendChild(createTextInput('client', 'MWoC'));
    form.appendChild(createTextInput('surveys', JSON.stringify([surveyResponse.getUploadData()])));


    console.log(survey.getPrompts());



    this.upload = function(callback){



        var uploadFrame = document.getElementById('upload-frame');

        uploadFrame.onload = function(){

            var response = getFrameContents(uploadFrame);
            console.log(response);
            if(callback){
                callback(JSON.parse(response));
            }
        };

        form.submit();

    }

    var getFrameContents = function (frame){

        var body;

        if ( frame.contentDocument ){
            // FF
            body = frame.contentDocument.getElementsByTagName('body')[0];
        }else if (frame.contentWindow){
            // IE
            body = frame.contentWindow.document.getElementsByTagName('body')[0];
        }
        return body.innerHTML;
    }

}