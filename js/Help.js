var Help = function(){

    var tutorials = [

        {
         title:'Using the Dashboard',
         text: 'Dashboard is the main page of the application. It allows \n\
                quick access to campaigns, surveys, the upload queue, help \n\
                tutorials and also allows users to log out.',
         img: 'img/screenshots/dashboard.png'
        },

        {
         title:'Installing Campaigns',
         text: 'To install a new campaign, navigate to the campaigns section\n\
                from the dashboard, and click on one of the campaigns listed \n\
                under the \'Available Campaigns\' menu. If there are currently\n\
                no campaigns installed on the phone, you will automatically be\n\
                redirected to the available campaigns section. ',
         img: 'img/screenshots/installing-campaigns.png'
        },

        {
         title:'TakingSurveys',
         text: 'Click on one of the surveys to answer survey related prompts.',
         img: 'img/screenshots/taking-surveys.png'
        },

        {
         title:'Uploading Responses',
         text: 'You can view responses that have not been uploaded in the upload\n\
                queue section. Here you have the option to delete all the pending\n\
                uploads, upload all responses, or upload/delete individual survey\n\
                responses.',
         img: 'img/screenshots/uploading-responses.png'
        },

        {
         title:'Changing Password',
         text: 'Enter your current password, a new password and a confirmation\n\
                of the new password to change your password. When your password\n\
                is successfully changed, you will be directed to the login page\n\
                where you can use your new password to login.',
         img: 'img/screenshots/changing-password.png'
        }

    ];

    var renderSection = function(section){

        var container = mwf.decorator.Form(section.title);

        var image = document.createElement('img');
        image.src = section.img;
        image.style.width = "90%";

        var div = document.createElement('div');
        div.style.textAlign = 'center';

        var textBlock = document.createElement('p');
        textBlock.innerHTML = section.text || "";
        textBlock.style.fontWeight ='bold';
        textBlock.style.padding = '7px';

        div.appendChild(image);
        div.appendChild(textBlock);
        container.addItem(div);

        return container;
    };

    this.render = function(){

        var container = document.createElement('div');

        var menu = mwf.decorator.Menu('Help Menu');

        var callback = function(section){
            return function(){
                container.removeChild(menu);
                var sectionView = renderSection(section);
                container.appendChild(sectionView);

                var hideSection = mwf.decorator.SingleClickButton('Help Menu', function(){
                    container.appendChild(menu);
                    container.removeChild(hideSection);
                    container.removeChild(sectionView);

                });

                container.appendChild(hideSection);

            };
        };

        for(var i = 0; i < tutorials.length; i++){

            var section = tutorials[i];

            menu.addMenuLinkItem(section.title, null, null).onclick = callback(section);
        }

        container.appendChild(menu);
        return container;

    };

};