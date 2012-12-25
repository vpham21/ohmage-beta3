var ConfigManager = (function() {
    
    var that = {};
    
    /**
     * Configuration store. To add new configuration value, add a new property
     * to this object and an accessor function will be generated. 
     */
    var config = {
        
        /**
         * ohmage server URL.
         */
        SERVER_ENDPOINT : "https://test.ohmage.org",
        
        /**
         * URL for reading campaigns.
         */
        CAMPAIGN_READ_URL : '/app/campaign/read',
        
        /**
         * URL for uploading surveys.
         */
        SURVEY_UPLOAD_URL : '/app/survey/upload',
        
        /**
         * Allows users to change their passwords.
         */ 
        PASSWORD_CHANGE_URL : '/app/user/change_password'
        
    };
    
    
    /**
     * Generic method for accessing any available property.
     */
    that.getProperty = function ( name ) {
        return config[ name ];
    };
    
    var property, camelCaseName;
    
    var toCamelCase = function( g ) {
        return g[1].toUpperCase();
    };
    
    /**
     * Creates a closure function to return the specified value. This is used 
     * to iterate through all the config properties and create accessor 
     * functions to return the config's value.
     */
    var addPropertyAccessor = function( configValue ) {
        return function(){
            return configValue;
        }
    };
    
    for( property in config ) {
        
        //Convert CONSTNAT_CASE to camelCase.
        camelCaseName = ("get_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase );
        
        //Create an accessor function to allow users to get property config 
        //value.
        that[ camelCaseName ] = addPropertyAccessor( config[property] );
    }
    
    return that;
    
})();