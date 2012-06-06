
var Spinner = new (function(){

    /**
     * Preload spinner image.
     */
    var spinnerImage = $('<img>')
                           .attr('src', 'img/spinner.gif')
                           .addClass('spinner-img');
    var isLoading = false;

    /**
     * Dislpays a loading spinner with a cancel link on a transparent background
     * that completely covers the document.
     *
     * To hide the displayed spinner, use hide_spinner().

     */
    this.show = function(cancelCallback){

        if(isLoading){
            return;
        }else{
            isLoading = true;
        }

        //Display the transparent background.
        showBackground();

        /*
         * The conscucted HTML will have the following structure:
         *
         *  <div class = "spinner-background" id = "spinner-background"></div>
         *
         *	<div class = "spinner-container">
         *		<div class = "spinner">
         *
         *			<img src = "img/spinner_standard.gif" class = "spinner-img"/>
         *
         *			<a href = "cancel_redirect_url" class = "cancel-link">
         *				Cancel Loading...
         *			</a>
         *
         *		</div>
         *	</div>
         *
         */

        var container = $("<div>");
        container.attr("class", "spinner-container");
        container.attr("id"   , "spinner-container");


        var spinner = $("<div>");
        spinner.attr("class", "spinner");
        spinner.attr("id"   , "spinner");
        spinner.append(spinnerImage);

        if(cancelCallback){

            var cancelLink = $("<a>");
            cancelLink.attr("href" , null);
            cancelLink.attr("class", "cancel_link");
            cancelLink.text("Cancel Loading...");

            cancelLink.onClick = function(){
                cancelCallback();
            };

            spinner.append(cancelLink);
        }



        container.append(spinner);
        $(document.body).append(container);

        //Calculate the left and top positions for the spinner div. Take into
        //account the fact that the user might have scrolled the window up or down
        //and even in that case, the div should be displayed about at the center of
        //the page.
        var spinnerTop = 140 + $(window).scrollTop() + "px";

        var spinnerLeft = $(window).scrollLeft() +
                          ($(window).width() - spinner.outerWidth()) / 2 + "px";


        //Set the top and left values for the spinner div.
        spinner.css("top" , spinnerTop);
        spinner.css("left", spinnerLeft);

    }

    var timer = null;
    var currentOrientation = null;
    var docWidth, docHeight;

    /**
     * The method resizes the translucent background image when the orientation of
     * the device changes.
     */
    var detectOrientation = function(){

        if(!window.orientation || !isLoading)
            return;

        //This is some crazy magic that I never want to visit again.
        if(currentOrientation == null || currentOrientation != window.orientation){
            var width, height, topOffset;

            if(isPortrait()){
                topOffset = 140;
                width = Math.min(docWidth, docHeight);
                height = Math.max(docWidth, docHeight);

            }else if(isLandscape()){
                topOffset = 80;
                width = Math.max(docWidth, docHeight) + 50;
                height = Math.min(docWidth, docHeight);
            }

            $("#spinner-background").width("0px").width(width + "px");
            $("#spinner-background").height("0px").height(height + "px");

            currentOrientation = window.orientation;

            var spinnerTop =  $(window).scrollTop() + topOffset + "px";
            var spinnerLeft = $(window).scrollLeft() + (width - $("#spinner").outerWidth()) / 2 + "px";

            //Set the top and left values for the spinner div.
            $("#spinner").css("top" , spinnerTop);
            $("#spinner").css("left", spinnerLeft);
        }
    }

    /**
     * The method displays the spinner's transparent background. A div that covers
     * the entire document's area will be added to the document's body with the ID
     * of spinner_background.
     */
    var showBackground = function(){

        //Create a div tag to represent the transparent spinner background.
        var background = $(document.createElement("div"));

        background.attr("class", "spinner-background");
        background.attr("id"   , "spinner-background");

        //Append the created background to the body of the
        $(document.body).append(background);

        docWidth = $(document).width();
        docHeight = $(document).height();

        //Set the backgrounds width and height to equal to the width and height of
        //the current document.
        $("#spinner-background").width(docWidth + "px");
        $("#spinner-background").height(docHeight + "px");

        timer = setInterval(function(){
            detectOrientation();
        }, 15);

    }


    /**
     * Removes the spinner transparent background and also the loading sign with the
     * cancel link.
     */
    this.hide = function(callback){

        if(!isLoading){
            return;
        }else{
            isLoading = false;
        }

        $("#spinner-background").fadeOut(25);
        $("#spinner-container").fadeOut(25, function(){
            $("#spinner-background,#spinner-container").remove();
            if(callback)
                callback();
        });

        if(timer){
            clearInterval(timer);
            delete timer;
        }
    }

    function isLandscape(){
        return ( window.orientation == 90 || window.orientation == -90 );
    }

    function isPortrait(){
        return ( window.orientation == 0 || window.orientation == 180 );
    }




});