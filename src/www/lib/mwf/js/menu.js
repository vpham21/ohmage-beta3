/**
 * MWF Decorator class for creating and manipulating menus and menu items.
 * This decorator class provides the functionality for adding items such as
 * detailed links, text blocks, checkbox and radio selection items, as well as
 * any arbitrary item compliant with MWF specification.
 *
 * The class does not require JQuery or third party Javascript library, but
 * depends on mwf.decorator class definition.
 *
 * Example Use:
 *
 * var menu = mwf.decorators.Menu();
 *
 * //Set menu's title.
 * menu.setTitle("Simple Link Menu");
 *
 * //Add to link menu items.
 * menu.addMenuLinkItem("Mobile Web Framework", "http://mwf.ucla.edu");
 * menu.addMenuLinkItem("UCLA Mobile Page", "http://m.ucla.edu");
 *
 * //Finally, add the menu to the document.
 * document.body.appendChild(menu);
 *
 * @namespace mwf.decorator.Menu
 * @dependency mwf.decorator
 * @author zkhalapyan
 * @copyright Copyright (c) 2010-11 UC Regents
 * @license http://mwf.ucla.edu/license
 * @version 20111115
 *
 */
mwf.decorator.Menu = function(title)
{

    /**
     * A CSS class name that indicates the first element in a list of elements.
     */
    var FIRST_MARKER = "menu-first";

    /**
     * A CSS class name that indicates the last element in a list of elements.
     */
    var LAST_MARKER  = "menu-last";

    /**
     * Create the menu as a parent prototype. This will be the object that will
     * be decorated with menu related functions and returned as the final result.
     */
    var menu = document.createElement('div');

    var attr = mwf.decorator.Attribute;

    var attributes = [
                            new attr("Padded",   true, "menu-padded"),
                            new attr("Full",     true, "menu-full"),
                            new attr("Detailed", true, "menu-detailed")
                         ];

    mwf.decorator.addAttributes(menu, attributes);


    /**
     * Sets the title of this menu. If the specified title is null or
     * undefined, then the menu's title, if it exists, will be removed.
     *
     * @param title The title of the menu to set.
     * @return This menu - allows chained invocations.
     */
    menu.setTitle = function(title)
    {
        //If current element has a title, then unset it.
        if(this._title)
        {
            mwf.decorator.unsetClass(this._title, FIRST_MARKER);
            mwf.decorator.unsetClass(this._title, LAST_MARKER);

            if(this._items && this._items.firstChild)
            {
                mwf.decorator.setClass(this._items.firstChild, FIRST_MARKER);
            }

            this.removeChild(this._title);

            this._title = null;
        }

        //Set title, if specified.
        if(title)
        {
            //Create a new title to add to the element, and save it in a member
            //variable.
            this._title = mwf.decorator.Title(title);

            mwf.decorator.setClass(this._title, FIRST_MARKER);

            if(this._items && this._items.firstChild)
            {
                mwf.decorator.unsetClass(this._items.firstChild, FIRST_MARKER);
            }
            else
            {
                mwf.decorator.setClass(this._title, LAST_MARKER);
            }

            this.insertBefore(this._title, this.firstChild);

        }

        return this;

    };

    /**
     * Returns the current elements title if it's set; null otherwise.
     * @return The current elements title if it's set; null otherwise.
     */
    menu.getTitle = function()
    {
        return (this._title)? this._title : null;
    };


    /**
     * Adds a generic item to the menu. The item will initially be placed inside
     * an li tag and then pushed into the top of the current menu's ordered
     * list. The method returns the current menu, allowing chained invocations.
     *
     * The method also adjusts first and last markers of this menu after
     * appending a new element.
     *
     * @param item The item to add to this menu.
     * @param raw If true, then menu item will not be processed. In other words,
     *            the added item will not initially be wrapped in an <li> tag.
     *
     * @return This menu - allows chained invocations.
     */
    menu.addMenuItem = function(item, raw)
    {
        raw = raw || false;

        if(!this._items)
        {
            this._items = document.createElement('ol');
            this.appendChild(this._items);
        }


        var listItem = item;

        if(!raw)
        {
            listItem = document.createElement('li');
            listItem.appendChild(item);

        }

        if(this._items.children.length === 0)
        {
            if(this._title)
            {
               mwf.decorator.unsetClass(this._title, LAST_MARKER);
            }
        }
        else
        {
            mwf.decorator.unsetClass(this._items.lastChild, LAST_MARKER);
        }

        mwf.decorator.setClass(listItem, LAST_MARKER);

        this._items.appendChild(listItem);

        return listItem;
    };

    /**
     * Adds a paragraph element with the specified text to the current menu.
     *
     * @param text The text to be enclosed in a <p> tag and added to the menu.
     * @return
     */
    menu.addMenuTextItem = function(text)
    {
        var textItem = document.createElement('p');

        //Set the paragraph's text.
        textItem.innerHTML = text;

        //Add the paragraph item to the menu's ordered list.
        return this.addMenuItem(textItem);
    };

     /**
     * Adds a link item to this menu.
     *
     * @param text    The text of the link item.
     *                This will be enclosed within an <a> tag.
     * @param url     The URL of the link item.
     * @param details An optional element that adds details section to the item.
     *
     * @return
     */
    menu.addMenuLinkItem = function(text, url, details)
    {
        return this.addMenuItem(createLinkItem(text, url, details));
    };

    menu.addMenuImageItem = function(text, url, img_url, details){

        var linkItem = createLinkItem(text, url, details);

        var img = document.createElement('img');
        img.src = img_url;

        linkItem.insertBefore(img, linkItem.firstChild);

        return this.addMenuItem(linkItem);

    }

    /**
     * Adds a link item to this menu with a 16x16 icon on the left side.
     *
     * @param text    The text of the link item.
     *                This will be enclosed within an <a> tag.
     * @param url     The URL of the link item.
     * @param img_url The URL of the 16x16 icon for this menu item.
     * @param details An optional element that adds details section to the item.
     *
     * @return This menu - allows chained invocations.
     */
    menu.addMenuIconItem = function(text, url, img_url, details)
    {
        var linkItem = createLinkItem(text, url, details);

        var icon = document.createElement('img');

        //ToDo: Future developments should extract this out into a CSS class.
        icon.src = img_url;
        icon.width  = 16;
        icon.height = 16;
        icon.style.verticalAlign='text-top';
        icon.style.paddingRight = "5px";

        linkItem.insertBefore(icon, linkItem.firstChild);

        return this.addMenuItem(linkItem);

    };


    /**
     * Creates a new radio input element and combines it with a link item to
     * create a menu item. Clicking the menu item will toggle the radio button.
     *
     * The actual link within the menu has an href attribute of "#".
     *
     * @param name    The name attribute of the input element.
     * @param value   The value attribute of the input element.
     * @param label   Text label associated with this option item.
     * @param details Details to display about this option.
     *
     * @return This menu - allowing chained invocation.
     */
    menu.addMenuRadioItem = function(name, value, label, details)
    {
       return this.addMenuItem(createOptionItem(name, value, label, details, true));
    };

    /**
     * Creates a new checkbox input element and combines it with a link item to
     * create a menu item. Clicking the menu item will toggle the button.
     *
     * The actual link within the menu has an href attribute of "#".
     *
     * @param name    The name attribute of the input element.
     * @param value   The value attribute of the input element.
     * @param label   Text label associated with this option item.
     * @param details Details to display about this option.
     *
     * @return This menu - allowing chained invocation.
     */
    menu.addMenuCheckboxItem = function(name, value, label, details)
    {
       return this.addMenuItem(createOptionItem(name, value, label, details, false));
    };

    menu.getSelectedOptions = function()
    {
        var selectedOptions = [];

        var menuItems = menu.getMenuItems();

        for(var i = 0; i < menuItems.length; i++)
        {
            var linkItem = menuItems[i].firstChild;
            var optionItem = linkItem.firstChild;


            if(optionItem.checked){
                selectedOptions.push({name: optionItem.name,
                                      value: optionItem.value,
                                      id: optionItem.id,
                                      label: linkItem.childNodes[1].nodeValue});
            }
        }

        return selectedOptions;
    };

    /**
     * Creates a new input element and combines it with a link item to create a
     * menu item. Two types of input elements are supported radios and
     * checkboxes. Clicking the menu item will toggle the checkbox/radio button.
     *
     *
     * @param name    The name attribute of the input element.
     * @param value   The value attribute of the input element.
     * @param label   Text label associated with this option item.
     * @param details Details to display about this option.
     * @param isRadio If true, the option item will be a radio input, checkbox
     *                otherwise.
     *
     * @return The created option item.
     */
    var createOptionItem = function(name, value, label, details, isRadio){

        //Create the input element.
        var inputItem = document.createElement('input');

        //Set the input's type, name, and value.
        inputItem.type  = (isRadio)? "radio" : "checkbox";
        inputItem.name  = name;
        inputItem.value = value;
        inputItem.style.verticalAlign = 'bottom';

        var toggle = function(){
            inputItem.checked =  (isRadio)? true : !inputItem.checked;
        };

        $(inputItem).bind("click", function(e){
            e.preventDefault();
        });

        $(inputItem).bind("touchmove", function(e){
           e.preventDefault();
           return false;
        });

        $(inputItem).bind("touchstart", function(e){
           e.preventDefault();
           return false;
        });

        $(inputItem).bind("touchend", function(e){
           e.preventDefault();
           toggle();
           return false;
        });

        //Create a standard menu link item and prepend the option button.
        var linkItem = createLinkItem(label, null, details);
        linkItem.insertBefore(inputItem, linkItem.firstChild);

        var toggleSelectionCallback = function(inputItem){
            return function(event){
                if(event.srcElement !== inputItem){
                    toggle();
                }
            };
        };

        TouchEnabledItemModel.bindTouchEvent(linkItem, linkItem, toggleSelectionCallback(inputItem), "menu-highlight");

        return linkItem;
    };



    /**
     * Creates a link item, without adding it to the current menu.
     *
     * @param text    The text of the link item.
     *                This will be enclosed within an <a> tag.
     * @param url     The URL of the link item.
     * @param details An optional element that adds details section to the item.
     *
     * @return Created menu item.
     */
    var createLinkItem = function(text, url, details) {
        var linkItem = document.createElement('a');

        linkItem.innerHTML = (typeof(text) != "undefined") ? text : "";
        linkItem.href = (typeof (url) != "undefined") ? url : null;

        // Fixes issue 255.
        if ($.browser.mozilla && url === undefined) {
            linkItem.href = "";
        }

        //If details are defined, then add the details text within a span tag.
        if( typeof(details) !== "undefined" && details != null ) {
            menu.setDetailed(true);

            linkItem.appendChild(document.createElement('br'));
            linkItem.appendChild(createDetailsSpan(details));
        }

        return mwf.decorator.removeEmptyAttributes( linkItem );
    };

    /**
     * Creates a new <span> element with .smallprint class and with inner html
     * equal to the passed argument.
     *
     * @param details The text to be enclosed within a <span> tag.
     * @return The created <span> element with class name ".smallprint".
     */
    var createDetailsSpan = function(details)
    {
        var detailsSpan = document.createElement('span');

        detailsSpan.innerHTML = details;
        detailsSpan.className = "smallprint";

        return detailsSpan;

    };

    /**
     * Returns the first element of the menu, if it exists. Null otherwise.
     * @return The first element of the menu.
     */
    menu.getFirstMenuItem = function()
    {
        return (this._items) ? this._items.firstChild : null;
    };

    /**
     * Returns the last element of the menu, if it exists. Null otherwise.
     * @return The last element of the menu.
     */
    menu.getLastMenuItem = function()
    {
        return (this._items) ? this._items.lastChild : null;
    };

    /**
     * Returns all the elements within the current menu. If the current menu
     * does not have any items, an empty array will be returned.
     *
     * @return All items within the current array.
     */
    menu.getMenuItems = function()
    {
        return (this._items) ? this._items.children : [];
    };

    menu.getItems = function(){
        return (this._items) ? this._items : null;
    }

    /**
     * Returns the menu item at a certain index. If the index is negative or is
     * out of bounds, then a null value will be returned.
     *
     * @return Menu item at specified index.
     */
    menu.getMenuItemAt = function(index)
    {
        if(this._items && 0 <= index && index < this._items.children.length)
        {
            return this._items.children[index];
        }

        return null;
    };

    /**
     * Returns the number of elements in the menu.
     *
     * @return the number of elements in the menu.
     */
    menu.size = function()
    {
        return (this._items) ? this._items.children.length : 0;
    };

    /**
     * Removes item at a given index.
     *
     * @return True if the item was successfully removed, false otherwise.
     */
    menu.removeMenuItemAt = function(index)
    {
        return this.removeItem(this.getMenuItemAt(index));
    };

    /**
     * Removes the given item.
     *
     * @return True if the item was successfully removed, false otherwise.
     */
    menu.removeMenuItem = function(item){
        if(this._items && item){
            //The return value of the removeChild method is either the removed
            //node, or null on failure.
            return this._items.removeChild(item) != null;
        }

        return false;
    };

    //If a default title has been set, then set the menu's title.
    if(title){
        menu.setTitle(title);
    }


    return menu;
};
