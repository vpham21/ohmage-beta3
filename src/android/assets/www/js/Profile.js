var Profile = new function(){

    this.render = function(){

        var container = document.createElement('div');

        var menu = mwf.decorator.Menu(auth.getUsername());

        menu.addMenuLinkItem('Change Password',   'password.html', 'Easily change your password.');
        menu.addMenuLinkItem('Logout and Clear Data', null, "When you logout, all the data stored on the phone will be completely erased.").onclick = function(){
            if(auth.logout()){
                PageNavigation.openAuthenticationPage();
            }
        };

        var dashboard = mwf.decorator.SingleClickButton("Dashboard", function(){
           PageNavigation.openDashboard();
        });

        container.appendChild(menu);
        container.appendChild(dashboard);

        return container;
    };
};