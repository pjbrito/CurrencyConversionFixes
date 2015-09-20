var WWidth, WHeight; 					// current window width and window height
var MaxLoadingTime = 1000;				// how long the page might load to be considered "fast"
var MoviesEnabled = true;				// global enable or disable loading movies
var isTouch = false;

/*	Define Click Event for Mobile */
if ('ontouchstart' in window) {var click = 'touchstart';} else {var click = 'click';}

$(document).ready(function(){
	// global settings and functions {
		WWidth = $(window).width();
		WHeight = $(window).height();
		touchSupport();					// check if this device supports touch
		calculateLoadingTime();			// fast or slow loading
		// create and operate currency widget if exists
		if (typeof currencyWidget == 'function') {currencyWidget();}
		$(".mobileMenuButton").on("click", showHideMenu);	// show/hide menu in mobile
		
		$( "#search" ).autocomplete({
			source: "search.php",	// url of endpoint which sends JSON data
			minLength: 2,
			select: function( event, ui ) {
				$(window).location(ui.item.location);
				// expects	"label" 	= what is displayed
				//			"location"	= url to open
			}
		});
	
		$(window).on('resize', ResizeWindow);	// when windows resizes
	// end of global settings and functions }

	function calculateLoadingTime(){
		timeDiff = Math.floor(Date.now()) - timeStamp;	// how long the page was loading
		// globally enable loading movies if loading time is low enough
		if (timeDiff < MaxLoadingTime){ MoviesEnabled = true;}
	}

	function ResizeWindow(){
		WWidth = $(window).width(); 
		WHeight = $(window).height();

		$(".logo").removeClass("hide").addClass("show");
		$("#page").removeAttr("style");
	}

	function showHideMenu(e){
		e.preventDefault();
		$(this).toggleClass('open');
		if ($("body").hasClass("overflowHidden")){
			$("body").removeClass("overflowHidden").addClass("overflowVisible");
			$(".page").removeClass("slideLeft").addClass("onScreen");
			$(".mainBar").removeClass("onScreen").addClass("slideRight");
			window.setTimeout(function(){
				$(".logo").removeClass("hide").addClass("show");
				$(".mobileBar").css({"position":"fixed", "top":"0em"});
			}, 500);
		} else {
			$(".mobileBar").css({"position":"absolute", "top": $(".mobileBar").offset().top});
			$(".logo").removeClass("show").addClass("hide");
			$("body").removeClass("overflowVisible").addClass("overflowHidden");
			$(".page").removeClass("onScreen").addClass("slideLeft");
			$(".mainBar").removeClass("slideRight").addClass("onScreen");
		}	
	}

	function touchSupport(){
		if ("ontouchstart" in window || navigator.msMaxTouchPoints){
			isTouch = true;	
			if (WWidth < 768){
				$("<link/>", {
					rel: "stylesheet",
					type: "text/css",
					href: "css/low-resources-style.css"
				}).appendTo("head");					
			}
		}	
	}
	
	// end of functions definitions }
});