var ConfigManager = (function() {
    
    var that = {};
    
    var configMap = LocalMap("config");
    
    /**
     * If set to true, will use test server for deployement.
     */
    var TEST_MODE = true;
    
    /**
     * List of available servers.
     */
    var SERVERS = [
        
        //Test server.
        "https://test.ohmage.org",
        
        //Prod server.
        "https://pilots.mobilizelabs.org"
    ];
    
    /**
     * Configuration store. To add new configuration value, add a new property
     * to this object and an accessor function will be generated. 
     */
    var config = {
        
        /**
         * ohmage server URL.
         */
        SERVER_ENDPOINT : SERVERS[ (TEST_MODE) ? 0 : 1 ],
        
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
    
    that.reset = function() {
        configMap.importMap( config );
    };
    
    /**
     * Generic method for accessing any available property.
     */
    that.getProperty = function ( name ) {
        return config[ name ];
    };
    
    /**
     * Returns a list of available servers.
     */
    that.getServers = function() {
        return SERVERS;
    };
    
    var property, camelCaseGetterName, camelCaseSetterName;
    
    var toCamelCase = function( g ) {
        return g[1].toUpperCase();
    };
    
    /**
     * Creates a closure function to return the specified value. This is used 
     * to iterate through all the config properties and create accessor 
     * functions to return the config's value.
     */
    var addPropertyGetter = function( propertyName ) {
        return function(){
            return config[ propertyName ];
        }
    };
    
    var addPropertySetter = function( propertyName ) {
      return function( newConfigValue ) {
          config[ propertyName ] = newConfigValue;
          configMap.set( propertyName, newConfigValue );
      };   
    };
    
    for( property in config ) {
        
        //Convert CONSTNAT_CASE to camelCase.
        camelCaseGetterName = ("get_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase );
        camelCaseSetterName = ("set_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase );
        
        //Create accessor functions to allow users to get and set config values.
        that[ camelCaseGetterName ] = addPropertyGetter( property );
        that[ camelCaseSetterName ] = addPropertySetter( property );
    }
    
    //Restore any values that have been stored in localStorage.
    for( var key in config ) {
        if ( configMap.isSet( key ) ) {
            config[ key ] = configMap.get( key );
        } 
    }
    
    return that;
    
})();