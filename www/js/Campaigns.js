var Campaigns = new (function() {

    var allCampaigns       = new LocalMap("all-campaigns");
    var installedCampaigns = new LocalMap("installed-campaigns");

    var isEmpty = function(){
        return allCampaigns.length() == 0;
    };

    this.uninstallCampaign = function(urn){
        installedCampaigns.release(urn);
    };

    this.getInstalledCampaigns = function(){

        var campaigns = [];

        for(var urn in installedCampaigns.getMap()){
            campaigns.push(new Campaign(urn));
        }

        return campaigns;

    };

    this.render = function(installed){

        //By default, only the installed campaigns will be displayed.
        if(typeof(installed) == 'undefined')
            installed = true;

        //If the user hasn't installed any campaigns, then just display the
        //available campaigns so the user can install one.
        if(installedCampaigns.length() == 0){
            installed = false;
        }

        var availableMenu = mwf.decorator.Menu("Available Campaigns");
        var installedMenu = mwf.decorator.Menu("My Campaigns");

        var install = function(urn){
            return function(){
                Campaign.install(urn, function(){
                    PageNavigation.openCampaignsView();
                });
            }
        };

        var open = function(urn){
            return function(){
                PageNavigation.openCampaignView(urn);
            }
        }

        for(var urn in allCampaigns.getMap()){

            //Campaign has been installed.
            if(installedCampaigns.isSet(urn)){
                installedMenu.addMenuLinkItem(allCampaigns.get(urn).name, null).onclick = open(urn);
            }else{
                availableMenu.addMenuLinkItem(allCampaigns.get(urn).name, null).onclick = install(urn);
            }

        }

        var container = document.createElement('div');


        if(installed){

            mwf.decorator.TopButton("Add Campaign", null, function(){
                PageNavigation.openCampaignsView(false);
            }, true);

            container.appendChild(installedMenu);
            container.appendChild(mwf.decorator.SingleClickButton("Upload Queue", function(){
                PageNavigation.openUploadQueueView();
            }));
        }

        if(!installed && availableMenu.size() > 0){

            if(installedCampaigns.length() > 0){
                mwf.decorator.TopButton("My Campaigns", null, function(){
                    PageNavigation.openCampaignsView(true);
                }, true);
            }

            $(availableMenu).find("a").css('background', "url('img/plus.png') no-repeat 95% center");

            container.appendChild(availableMenu);
            container.appendChild(mwf.decorator.SingleClickButton("Refresh Campaigns", function(){

                var onSuccess = function(){
                    showMessage("All campaigns have been updated.", function(){
                        PageNavigation.openCampaignsView(false);
                    });
                };

                var onError = function(){
                    showMessage("Unable to download all campaigns. Please try again.");
                };

                Campaigns.download(true, onSuccess, onError);
            }));
        }


        return container;

    }


    this.download = function(force, onSuccess, onError){

        if(typeof(force) == undefined)
            force = false;

        if(!force && !isEmpty()){
            if(onSuccess)
                onSuccess();
            return;
        }

        var _onError = function(response){

            Spinner.hide(function(){
                if(onError){
                    onError(response);
                }
            });
        };

        var _onSuccess = function(response) {

            Spinner.hide(function(){

                if(response.result === "success"){

                    var campaigns = new LocalMap("all-campaigns");

                    campaigns.erase();

                    for(var urn in response.data){
                        campaigns.set(urn, response.data[urn]);
                    }

                    if(onSuccess){
                        onSuccess();
                    }
                }
            });


        };

        Spinner.show();

        api(
             "POST",
             CAMPAIGN_READ_URL,
             {
                 user:          auth.getUsername(),
                 password:      auth.getHashedPassword(),
                 client:        'MWoC',
                 output_format: 'short'
             },
             "JSON",
             _onSuccess,
             _onError
        );
    }

})();


