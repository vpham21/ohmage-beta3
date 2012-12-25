module( "config.ConfigManager", {
  setup: function() {
    //No setup required.
  },
  teardown: function() {
    //No teardown required.
  }
});

test( "Test ConfigManager.getProperty()", function() {

    ///
    var serverEndpoint = ConfigManager.getProperty( "SERVER_ENDPOINT" );
    var campaignReadUrl = ConfigManager.getProperty( "CAMPAIGN_READ_URL" );
    var surveyUploadUrl = ConfigManager.getProperty( "SURVEY_UPLOAD_URL" );
    var passwordChangeUrl = ConfigManager.getProperty( "PASSWORD_CHANGE_URL" );
    ///

    ok( ( typeof( serverEndpoint ) !== "undefined" ),    "Should be able to get SERVER_ENDPOINT property." );
    ok( ( typeof( campaignReadUrl ) !== "undefined" ),   "Should be able to get CAMPAIGN_READ_URL property." );
    ok( ( typeof( surveyUploadUrl ) !== "undefined" ),   "Should be able to get SURVEY_UPLOAD_URL property." );
    ok( ( typeof( passwordChangeUrl ) !== "undefined" ), "Should be able to get PASSWORD_CHANGE_URL property." );
});

test( "Test ConfigManager.getConfigProperty()", function() {

    ///
    var serverEndpoint = ConfigManager.getServerEndpoint();
    var campaignReadUrl = ConfigManager.getCampaignReadUrl();
    var surveyUploadUrl = ConfigManager.getSurveyUploadUrl();
    var passwordChangeUrl = ConfigManager.getPasswordChangeUrl();
    ///

    ok( ( typeof( serverEndpoint ) !== "undefined" ),    "Should be able to get SERVER_ENDPOINT property." );
    ok( ( typeof( campaignReadUrl ) !== "undefined" ),   "Should be able to get CAMPAIGN_READ_URL property." );
    ok( ( typeof( surveyUploadUrl ) !== "undefined" ),   "Should be able to get SURVEY_UPLOAD_URL property." );
    ok( ( typeof( passwordChangeUrl ) !== "undefined" ), "Should be able to get PASSWORD_CHANGE_URL property." );
});