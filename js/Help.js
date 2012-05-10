var Help = function(){

    var tutorials = [

        {
         title:'Using the Dashboard',
         text: 'Dashboard is the main page of the application. It allows \n\
                quick access to campaigns, surveys, upload queue, help \n\
                tutorials and also allows users to log out.',
         img: 'img/screenshots/dashboard.png'
        },

        {
         title:'Installing Campaigns',
         text: '',
         img: 'img/screenshots/installing-campaigns.png'
        },

        {
         title:'TakingSurveys',
         text: '',
         img: 'img/screenshots/taking-surveys.png'
        },

        {
         title:'Uploading Responses',
         text: '',
         img: 'img/screenshots/uploading-responses.png'
        },

        {
         title:'Changing Password',
         text: '',
         img: 'img/screenshots/changing-password.png'
        }

    ];

    var renderSection = function(section){

        var container = mwf.decorator.Form(section.title);

        var image = document.createElement('img');
        image.src = section.img;
        image.style.width = "100%";
        container.addItem(image);

        if(section.text){
            container.addTextBlock(section.text);
        }

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