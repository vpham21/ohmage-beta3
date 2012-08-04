var CustomPropertiesVault = function(prompt){
   var self = {};
   
   var vault = new LocalMap(CustomPropertiesVault.VAULT_LOCAL_MAP_NAME);
   
   var campaignURN = prompt.getCampaignURN();
   var surveyID    = prompt.getSurveyID();
   var promptID    = prompt.getID();
   
   //Prepare the structures for accessing prompt specific properties.
   var campaignProperties = vault.get(campaignURN) || {};
   var surveyProperties   = campaignProperties[surveyID] || {};
   var promptProperties   = surveyProperties[promptID]   || [];
   
   var save = function(){
       surveyProperties[promptID] = promptProperties;
       campaignProperties[surveyID] = surveyProperties;
       vault.set(campaignURN, campaignProperties);
   };
   
   self.addCustomProperty = function(customChoice){
       promptProperties.push(customChoice);
       save();
   };
   
   self.getCustomProperties = function(){
       return promptProperties;
   };
   
   self.deleteCustomProperties = function(){
       promptProperties = [];
       save();
   };
   
   return self;
};

CustomPropertiesVault.VAULT_LOCAL_MAP_NAME = 'custom-properties-vault';

CustomPropertiesVault.deleteAllCustomProperties = function(){
    (new LocalMap(CustomPropertiesVault.VAULT_LOCAL_MAP_NAME)).erase(); 
};