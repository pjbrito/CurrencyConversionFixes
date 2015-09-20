var tSep = " ";							// tousends separator
var dSep = ".";							// decimal separator

var DefaultStartCurrency = "GBP";
var DefaultConvertToCurrency = "EUR";
var CurrenciesURL = "currenciesJSON.json";
var CurrencyList = [
	{"Name":"GBP","Description":"British Pound"},
	{"Name":"EUR","Description":"Euro"},
	{"Name":"USD","Description":"US Dollar"},
	{"Name":"AUD","Description":"Australian Dollar"},
	{"Name":"CAD","Description":"Canadian Dollar"},
	{"Name":"CHF","Description":"Swiss Franc"},
	{"Name":"CZK","Description":"Czech Republic Koruna"},
	{"Name":"DKK","Description":"Danish Kroner"},
	{"Name":"HKD","Description":"Hong Kong Dollar"},
	{"Name":"INR","Description":"Indian Rupee"},
	{"Name":"JPY","Description":"Japanese Yen"},
	{"Name":"NOK","Description":"Norwegian Krone"},
	{"Name":"NZD","Description":"New Zealand Dollar"},
	{"Name":"PLN","Description":"Polish Zloty"},
	{"Name":"SEK","Description":"Swedish Krona"},
	{"Name":"SGD","Description":"Singapore Dollar"},
	{"Name":"THB","Description":"Thai Baht"},
	{"Name":"ZAR","Description":"South African Rand"},
	{"Name":"AED","Description":"United Arab Emirates Dirham"},
	{"Name":"HUF","Description":"Hungarian Forinz"},
	{"Name":"HRK","Description":"Croatian Kuna"},
	{"Name":"TRY","Description":"Turkish Lira"},
	{"Name":"MAD","Description":"Moroccan Dirham"},
	{"Name":"ILS","Description":"Israel Shekel"},
	{"Name":"MXN","Description":"Mexican Peso"},
	{"Name":"BHD","Description":"Bahraini Dinar"},
	{"Name":"XCD","Description":"East Carribean Dollar"},
	{"Name":"BBD","Description":"Barbados Dollar"},
	{"Name":"RUB","Description":"Russian Ruble"},
	{"Name":"CNY","Description":"China Yuan Renminbi"},
	{"Name":"BSD","Description":"Bahamian Dollar"},
	{"Name":"KYD","Description":"Cayman Island Dollar"},
	{"Name":"GHS","Description":"Ghanaian Cedi"}
];

function currencyWidget(){	// currency widget -----------------------------------------------
	if (!CurrencyList){$.getJSON(CurrenciesURL, function(json){CurrencyList = json;});}
	$("#from, #to").selectmenu({create: function(event, ui){
		// create currencies menus from JSON array
		for (var i in CurrencyList){
			$("#from, #to").append($("<option></option>").attr("value",CurrencyList[i].Name).text(CurrencyList[i].Name + " - " + CurrencyList[i].Description));
		}
	}});
	// initialize control's state
	$("#from").val(DefaultStartCurrency).selectmenu("refresh");
	$("#to").val(DefaultConvertToCurrency).selectmenu("refresh");
	$("#from-button .ui-selectmenu-text").html(DefaultStartCurrency).addClass(DefaultStartCurrency);
	$("#to-button .ui-selectmenu-text").html(DefaultConvertToCurrency).addClass(DefaultConvertToCurrency);
		
	// when text edit was selected then select all text inside but only on desktop
	// as on mobile devices it's kind of confusing.
	if (!isTouch){$("#amount").focus(function(){$(this).select();});}

	// if the same currencies were choosen then choose another currency in a second box
	if ($("#from option:selected").val() == $("#to option:selected").val()){$("#to").val("EUR").selectmenu("refresh");}
	
	$("#from, #to").selectmenu({
		open: function(event, ui){
			if (isTouch){
				$("#from-menu, #to-menu").parent().removeAttr("style");
				$("#from-menu, #to-menu").parent().css({"top":"1em", "left":"50%", "margin-left":"-" + ($("#from-menu").width()/2) + "px"});
				// $("#from-menu, #to-menu").addClass("lowResourcesMenu");
			} else {	// if this device is not touch enabled then we display dropdown menu with scrollbar
				$("#from-menu, #to-menu").css({"max-height":"120px"});
				$("#from-menu, #to-menu").niceScroll(); // add scroll bar to a dropdown menu
				// $("#from-menu, #to-menu").removeClass("lowResourcesMenu");
			}
		}
	});
	$("#from").selectmenu({select: function(e, ui){
		$("#from > option").each(function(i){
			$("#amount").removeClass(this.value);	// remove old classes
			$("#from-button .ui-selectmenu-text").removeClass(this.value);
		})
		$("#amount").addClass(ui.item.value);		// display selected currency
		if (!isTouch){$("#amountValue").select().focus();}
		$("#from-button .ui-selectmenu-text").html(ui.item.value).addClass(ui.item.value);
	}});
	
	$("#to").selectmenu({select: function(e, ui){
		$("#to > option").each(function(i){
			$("#amountCounted").removeClass(this.value);	// remove old classes
			$("#to-button .ui-selectmenu-text").removeClass(this.value);
		})
		$("#amountCounted").addClass(ui.item.value);		// display selected currency
		$("#to-button .ui-selectmenu-text").html(ui.item.value).addClass(ui.item.value);
	}});
	$("#amount").keypress(function(event){
		if (event.which == 13) { // on enter pressed
			event.preventDefault();
		} else {
			if ((event.which >= 48 && event.which <= 57) || (event.which < 48)){
				// only numbers and edit keys may be pressed
			} else {event.preventDefault();}
		}
	});
	$("#amount").bind('input', function(e){
		var text = $(this).val();
		text = text.replace(/ /g,"");
		text = text.replace(/,/g,"_");
		var textEnd = text.indexOf(dSep);
		var rest = "";
		if (text.split(dSep).length-1 > 1){
			text = text.substring(0, text.length - 1);
		}
		if (textEnd < 1) {textEnd = text.length;}
		else {
			rest = text.substring(textEnd, text.length);
		}
		var textInt = text.substring(0, textEnd);
		var newText = "";
		while (textInt.length > 3){
			newText =  (textInt.substring(textInt.length - 3, textInt.length)) + tSep + newText;
			textInt = textInt.substring(0, textInt.length - 3);
		}
		newText = textInt + tSep + newText;
		$(this).val(newText.trim() + rest);
	});
	
	$("#arrow-hor, #arrow-vert").click(function(){
		var f = $("#from").val(), t = $("#to").val();
		$("#from").val(t).selectmenu("refresh");
		$("#to").val(f).selectmenu("refresh");	
		$("#from-button .ui-selectmenu-text").html(t).addClass(t);	
		$("#to-button .ui-selectmenu-text").html(f).addClass(f);
		$("#arrow-hor").toggleClass("fa-flip-horizontal");
		$("#arrow-vert").toggleClass("fa-flip-vertical");
	});
}	// ----------------------------------------------- end currency widget	
