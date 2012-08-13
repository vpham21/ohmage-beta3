invokeOnReady(function(){
    var helpController = new HelpController();
    var sectionIndex = PageNavigation.getPageParameter('help-section-index');
    $('#help-container').append(helpController.renderHelpSection(sectionIndex));
});