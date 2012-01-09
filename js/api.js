
/**
 * OHMAGE server URL.
 */
var OG_SERVER = 'https://dev.mobilizingcs.org';

/**
 * The URL for the authentication server.
 */
var AUTH_URL = '/app/user/auth_token';

/**
 * URL for reading campaigns.
 */
var CAMPAIGN_READ_URL = '/app/campaign/read';


function authCheck(redirectURL)
{
    //If the authentication token already exists, redirect the user to the 
    //campaigns view.
    if($.cookie("auth_token") != null)
    {   
        redirect(redirectURL);
    }
}

function authUser(username, password, redirectURL)
{
 
    authCheck(redirectURL);
    
    //On successful authentication, save the token in a cookie and then redirect
    //the user to the specified URL.
    var onSuccess = function(response) 
    {
        //Save the authenticatin token in a cookie.
        $.cookie('auth_token', response.token);
        
        //Redirect the user.
        redirect(redirectURL);

    }
   
    //ToDo: Use some cool display to indicate an error.
    var onError = function(response)
    {
        alert(response.errors[0].text);    
    };
    
    
    
   //Make an API call.
   api(
       "POST",
       AUTH_URL,
       {
            user : username, 
            password: password, 
            client: '1'
       },
       'JSON',
       onSuccess,
       onError
     );
    

   
}


function getCampaigns(onSuccess, onError)
{
    if(window.localStorage && window.localStorage.campaigns)
    {
        onSuccess(JSON.parse(window.localStorage.campaigns));
        return;
    }
    
    var _onSuccess = function(response)
    {
        if(window.localStorage)
        {
            window.localStorage.campaigns = JSON.stringify(response);
        }
        
       onSuccess(response); 
    }
    
    api
    ( 
         "POST",
         CAMPAIGN_READ_URL,
         {
             auth_token: $.cookie('auth_token'),
             client: '1',
             output_format: 'long'
         },
         "JSON",
         _onSuccess,
         onError 
    );

}

/**
 * Redirects the user to the page that displays a list of available campaigns.
 */
function openCampaignsView()
{
    redirect("campaigns.html");
}

/**
 * Redirects the user to the page that displays the campaign's surveys.
 * 
 * @param campaignURN The unique identifier of the campaign to display.
 * 
 */
function openCampaignView(campaignURN)
{
    redirect("campaign.html?campaignURN=" + campaignURN);
}

/**
 * Redirects the user to the page that displays the campaign's surveys.
 * 
 * @param campaignURN The unique identifier of the survey's campaign.
 * @param surveyID The unique identifier of the campaign's survey to display.
 */
function openSurveyView(campaignURN, surveyID)
{
    redirect("survey.html?campaignURN=" + campaignURN + 
                           "&surveyID=" + surveyID);
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
        
        console.log("Received API call response for URL " + url);
        console.log(response);
            
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
    if(fun != null && 
       fun != undefined && 
       typeof fun == 'function')
    {
        fun(args);
    }
  
  /*
	var fn = window[callback];

	if(typeof fn === 'function') 
	{
          alert(fn);
	    fn();
	}
  */
}

/**
 * Redirects the user to a specified URL. Although this can be easily achieved 
 * via a simple document.location = "..." statement, the reason that this
 * method is prefered is because in a native environment redirection mechansim
 * might change.
 * 
 * @param url The URL to redirect to. If null or undefined, the method exits 
 *            without throwing any errors.
 */
function redirect(url)
{
    if(url)
    {
        document.location = url;
    }
}