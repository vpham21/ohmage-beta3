
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



function login()
{
  authUser("zorayr.mwf", "zorayr.MWF1", "campaigns_view.html");
}
//login("zorayr.mwf", "zorayr.MWF1", "campaigns_view.html");

function authUser(username, password, redirectURL)
{
 
    //If an authentication token is already set, then redirect the user without
    //making an API call.
    if($.cookie('auth_token') != null)
    {
        redirect(redirectURL);
    }
    
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


/**
 * Retrieves and displays a list of available campaings. 
 * 
 * Campaigns that have already been downloaded will be loaded in 
 * #my_campaigns_menu and campaigns that are available to the user but are not 
 * yet downloaded will be displayed in #available_campaigns_menu. 
 * 
 * In case either available campaigns or my campaigns are empty, the div will
 * be hidden. If no campaigns are avaiable at all, then the user will be
 * notified with an appropriate message.
 * 
 * 
 */
function loadCampaigns()
{
    var onSuccess = function(response) {
    			
        var metadata = response.metadata;
        var data     = response.data;

        var availableCampaignsMenu = $("#available_campaigns_menu");
        
        //ToDo: This meny should contain campaigns that have been downloaded in
        //offline storage.
        var myCampaignsMenu        = $("#my_campaigns_menu");

        //ToDo: Change this. 
        $("#my_campaigns").hide();

        for(var i = 0; i < metadata.number_of_results; i++)
        {
            //Campaign URN.
            var urn = metadata.items[i];

            //Create a list item for the menu.
            var menuItem = $('<li>');

            //If the list item is the last item in the menu, mark it 
            //with menu-last class for assuring compatability. 
            if(i == metadata.number_of_results - 1)
            {
                menuItem.attr("class", "menu-last");       
            }

            //Create a link to the campaign.
            var campaignLink = $('<a>');
            campaignLink.text(data[urn].name);
            campaignLink.attr("href", 
                              "javascript:openCampaignView('" + urn + "')");



            menuItem.append(campaignLink);
            availableCampaignsMenu.append(menuItem);


        }

	};
    
    var onError = function(response)
    {
        alert(response.errors[0].text);    
    }

    //Make the API call.
    api( 
         "POST",
         CAMPAIGN_READ_URL,
         {
             auth_token: $.cookie('auth_token'),
             client: '1',
             output_format: 'short'
         },
         "JSON",
         onSuccess,
         onError 
        );

}

/**
 * Redirects the user to the page that displays a list of available campaigns.
 */
function openCampaignsView()
{
    redirect("campaigns_view.html");
}

/**
 * Redirects the user to the page that displays the campaign's surveys.
 * 
 * @param campaignURN The unique identifier of the campaign to display.
 * 
 */
function openCampaignView(campaignURN)
{
    redirect("campaign_view.html?campaignURN=" + campaignURN);
}

/**
 * Redirects the user to the page that displays the campaign's surveys.
 * 
 * @param campaignURN The unique identifier of the survey's campaign.
 * @param surveyID The unique identifier of the campaign's survey to display.
 */
function openSurveyView(campaignURN, surveyID)
{
    redirect("survey_view.html?campaignURN=" + campaignURN + 
                             "&surveyID=" + surveyID);
}

function loadSurveys(campaignXML)
{
    
}

/**
 * Extracts and returns the campaign from the API's campaign read response.
 * 
 * @param response    Response result from campaign read API call.
 * @param campaignURN The specific campaign URN to extract from the response. 
 */
function getCampaign(response, campaignURN)
{
    return $.xml2json.parser(response.data[campaignURN].xml).campaign;
}

/**
 * Extracts and returns a list of surveys from the API's campaign read response.
 * 
 * @param response    Response result from campaign read API call.
 * @param campaignURN The survey's campaign's URN. Used to get the campaign from 
 *                    the response. 
 */
function getSurveys(response, campaignURN)
{
    //Get the list of surveys from the campaign.
    var surveys  = getCampaign(response, campaignURN).surveys.survey;

    //If survey is returned as a single item, then go ahead and place
    //it in an array. This is a kind of a dirty fix, if you have any 
    //better ideas of approaching the situatin - please be my guest. 
    if(surveys.length == undefined)
    {
        surveys = [surveys];
    }
    
    return surveys;
}

/**
 * Extracts and returns a specific survey from a campaign.
 * 
 * @param response    Response result from campaign read API call.
 * @param campaignURN The survey's campaign's URN. Used to get the campaign from 
 *                    the response. 
 * @param surveyID    The specific survey ID to retrieve from the campaign.                   
 */
function getSurvey(response, campaignURN, surveyID)
{
    //Get a list of all the possible surveys.
    var surveys = getSurveys(response, campaignURN);
    
    //Iterate through the list of retrieved surveys. If a ID match is found, 
    //return the survey.
    for(var i = 0; i < surveys.length; i++)
    {
       if(surveys[i].id == surveyID)
       {
           return surveys[i];
       }
    }
    
    return null;
}


/**
 * Extracts and returns a list of prompts.
 * 
 * @param response    Response result from campaign read API call.
 * @param campaignURN The survey's campaign's URN. Used to get the campaign from 
 *                    the response. 
 * @param surveyID    The specific survey ID to retrieve from the campaign.                   
 */
function getPrompts(response, campaignURN, surveyID)
{
    return getSurvey(response, campaignURN, surveyID).contentlist.prompt;
}

function getPromptProperties(prompt)
{
    return prompt.properties.property;
}


/**
 * If the campaign configuration file has already been loaded into the local
 * storage, then the method will load the cached version. 
 */
function downloadCampaignXMLConfig(campaignURN, onSuccess, onError)
{
	
    api(
        "POST",
        CAMPAIGN_READ_URL,
        {
            auth_token: $.cookie("auth_token"),
            client: 1,
            output_format: 'long',
            campaign_urn_list:campaignURN
        },	  
        'JSON',
        onSuccess,
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
    if(url != undefined && url != null)
    {
        document.location = url;
    }
}