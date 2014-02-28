
Init.invokeOnReady(function() {
    $('#help-container').append((new HelpController()).renderHelpMenu());
    mwf.decorator.TopButton("Dashboard", null, PageNavigation.openDashboard, true);
});