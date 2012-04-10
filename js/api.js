
/**
 * OHMAGE server URL.
 */
var OG_SERVER = "https://dev.mobilizingcs.org";
//var OG_SERVER = "https://dev.andwellness.org";

/**
 * URL for reading campaigns.
 */
var CAMPAIGN_READ_URL = '/app/campaign/read';

/**
 * URL for uploading surveys.
 */
var SURVEY_UPLOAD_URL = '/app/survey/upload';

function getCampaigns(onSuccess, onError)
{
    if(window.localStorage && window.localStorage.campaigns){
        onSuccess(JSON.parse(window.localStorage.campaigns));
        return;
    }

    var _onSuccess = function(response)
    {
        if(window.localStorage){
            window.localStorage.campaigns = JSON.stringify(response);
        }

       onSuccess(response);
    };

    var auth = new UserAuthentication();

    api(
         "POST",
         CAMPAIGN_READ_URL,
         {
             //User authentication information.
             user: auth.getUsername(),
             password: auth.getHashedPassword(),

             client: '1',
             output_format: 'long'
         },
         "JSON",
         _onSuccess,
         onError
    );

}


/**
 * The method is the primary point of interaction with the Ohmage API.
 *
 * On API call response, the method will analyze the contents of the response
 * and depending on the contents will either invoke onSuccess or onError
 * callbacks.
 *
 * URL argument is the relative path for the API URL. Ohmage server path will be
 * augmented prior to AJAX calls.
 *
 * @param type      The AJAX call type i.e. POST/GET/DELETE.
 * @param url       The API URL extension i.e. /app/survey/upload.
 * @param data      The data sent with the AJAX call.
 * @param dataType  The data type for the AJAX call i.e. XML, JSON, JSONP.
 * @param onSuccess The callback on API call success.
 * @param onError   The callback on API call error.
 */
function api(type, url, data, dataType, onSuccess, onError)
{
    var onResponse = function(response) {

        console.log("Received API call response for URL %s ", url, response);

        switch(response.result)
        {
            case 'success':
                invoke(onSuccess, response);
                break;

            case 'failure':
                invoke(onError, response);
                break;

            default:
                console.log("Unknown response.");
                break;
        }
	};

    $.ajax(
    {
        type: type,
        url : OG_SERVER + url,
        data: data,
        dataType: dataType,
        success : onResponse
    });

}



/**
 * Invokes the method 'fun' if it is a valid function. In case the function
 * method is null, or undefined then the error will be silently ignored.
 *
 * @param fun  the name of the function to be invoked.
 * @param args the arguments to pass to the callback function.
 */
function invoke(fun, args)
{
    if(fun && typeof fun === 'function'){
        fun(args);
    }
}

