Init.invokeOnReady(function() {
    $('#view').append(ProfileController().renderProfileView());
    mwf.decorator.TopButton("Dashboard", null, PageNavigation.openDashboard, true);
});