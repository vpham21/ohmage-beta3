Init.invokeOnReady(function() {
    $('#view').append((new ChangeServerController()).renderChangeServerView());
    mwf.decorator.TopButton("Login", null, PageNavigation.openAuthenticationPage(), true);
});