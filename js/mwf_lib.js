var MWFLib = function()
{
    
   
    
    
}



/**
 * 
 */
MWFLib.doubleButtonDiv = function(leftButtonText, leftButtonCallback, 
                                rightButtonText, rightButtonCallback)
{
    var buttonsDiv = $('<div>');
    buttonsDiv.attr("class", "button-full button-padded");

    var leftButton = $('<a>');
    leftButton.attr("class", "button-light button-first");
    leftButton.text(leftButtonText);

    var rightButton = $('<a>');
    rightButton.attr("class", "button-light button-last");
    rightButton.text(rightButtonText);

    buttonsDiv.append(leftButton);
    buttonsDiv.append(rightButton);

    return buttonsDiv;
}   


/**
 * MWF CONTENT
 */
var MWFContent = function()
{
    
}

MWFContent.createTitle = function(titleText)
{
    var header = $("<h1>");
    header.attr("class", "content-first light");
    header.text(titleText);

    return header;
}

MWFContent.createSimpleContent = function createContent(titleText, contentText)
{
    var contentDiv = $('<div>');
    contentDiv.attr("class", "content-full content-padded");
    
    var contentTitle = MWFContent.createTitle(titleText);
    
    var contentPar = $('<p>');
    contentPar.attr("class", "content-last");
    contentPar.html(contentText);
    
    contentDiv.append(contentTitle);
    contentDiv.append(contentPar);
    
}





/**
 * MWF MENU
 */
var MWFMenu = function(titleText)
{
    var menuList = $('<ol>');
    var menu     = $('<div>')
                         .attr("class", "menu-full menu-detailed menu-padded")
                         .append(createMenuTitle(titleText))
                         .append(menuList);
                         
   
    
    this.getMenu = function()
    {
        menuList.children().attr("class", "");
        
        return menu;
    }
    
    this.addMenuItem = function(item)
    {
        menuList.append($('<li>').append(item));
    }
    
}

MWFMenu.createMenuTitle = function(titleText)
{
    var header = $("<h1>");
    header.attr("class", "menu-first light");
    header.text(titleText);

    return header;
}