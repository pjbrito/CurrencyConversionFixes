$(function () {
    $("#jsGrid").jsGrid({
        height: "90%",
        width: "50%",
        autoload: true,
        paging: false,

        controller: {
            loadData: function () {
                var deferred = $.Deferred();

                var tmpRates = getStoredLiveRates("LiveRates");
                if (!tmpRates || isNaN(tmpRates.timestamp) ||
                    (+new Date()) + (3600 * 1000) < (tmpRates.timestamp * 1000)) {
                    $.ajax({
                        url: 'https://openexchangerates.org/api/latest.json?app_id=024da351f3674da9b2c93dbcd2fbf9ca',
                        dataType: 'json',
                        success: function (data) {
                            setStoredLiveRates("LiveRates", data); // cache current rates
                            setStoredLiveRates("LiveRatesForDelta", tmpRates); // also cache previous rates (for delta)

                            var allRates = _.pairs(data.rates);
                            deferred.resolve(_.first(allRates, 5));
                        }
                    });
                } else {
                    var allRates = _.pairs(tmpRates.rates);
                    deferred.resolve(_.first(allRates, 5));
                }

                return deferred.promise();
            }
        },

        rowRenderer: function (item) {
            if (!Array.isArray(item) || item.length < 2) {
                return $("<tr>");
            }

            var currencyCode = item[0];
            var currencyRate = Number(item[1] || 0);
            var currencyRateDelta = Number(getStoredLiveRates("LiveRatesForDelta").rates[currencyCode] || 0);
            var currentDelta = (currencyRate - currencyRateDelta);

            var rate = { // rate
                code: currencyCode,
                img: getFlagForCurrencyCode(currencyCode),
                currentRate: currencyRate,
                currentDelta: currentDelta.toFixed(6),
                currentDeltaPercent: Math.abs(currencyRate === 0 ? 0 : (currentDelta / currencyRate * 100)).toFixed(3)
            };
            return $("<tr>")
	            .append($("<td>").prepend($('<img>',{src:rate.img,width:'100%'})))
	            .append($("<td>").text(rate.code))
	            .append($("<td nowrap>").text(rate.currentRate))
               	.append((Math.abs(rate.currentDelta) < 0.001) ? $("<td nowrap>").text(rate.currentDelta) : (rate.currentDelta >= 0.001 ?
                    $('<td nowrap class="green">').prepend($('<span>',{class:'fa fa-caret-up'})).text(rate.currentDelta) :
                    $('<td nowrap class="red">').prepend($('<span>',{class:'fa fa-caret-up'})).text(rate.currentDelta))
                )
               	.append((Math.abs(rate.currentDelta) < 0.001) ? $("<td nowrap>").text(rate.currentDeltaPercent) : (rate.currentDelta >= 0.001 ?
                    $('<td nowrap class="green">').prepend($('<span>',{class:'fa fa-caret-down'})).text(rate.currentDeltaPercent) :
                    $('<td nowrap class="red">').prepend($('<span>',{class:'fa fa-caret-down'})).text(rate.currentDeltaPercent))
                );
        },

        fields: [
            { name: "Currenty", type: "text" },
            { name: "Rate", type: "number" },
            { name: "Change", type: "text" },
            { name: "Change %", type: "text" }
        ]
    });

    function getStoredLiveRates(key) {

        // this is a private function
        var getStoredRate = function (key) {
            var ratesString = sessionStorage.getItem(key);
            if (ratesString && IsJsonString(ratesString)) {
                return JSON.parse(ratesString);
            } else {
                if (key === "LiveRatesForDelta") {
                    return getLiveRatesMock().liveMockDelta;
                } else if (key === "LiveRates") {
                    return getLiveRatesMock().liveMock;
                } else {
                    return {};
                }
            }
        };

        if (key === "LiveRates" || key === "LiveRatesForDelta") {
            return getStoredRate(key);
        } else {
            return {};
        }
    }

    function getLiveRatesMock() {
        // https://openexchangerates.org/api/latest.json?app_id=024da351f3674da9b2c93dbcd2fbf9ca
        return {
            liveMock: {
                "disclaimer": "Exchange rates are provided for informational purposes only, and do not constitute financial advice of any kind. Although every attempt is made to ensure quality, NO guarantees are given whatsoever of accuracy, validity, availability, or fitness for any purpose - please use at your own risk. All usage is subject to your acceptance of the Terms and Conditions of Service, available at: https://openexchangerates.org/terms/",
                "license": "Data sourced from various providers with public-facing APIs; copyright may apply; resale is prohibited; no warranties given of any kind. Bitcoin data provided by http://coindesk.com. All usage is subject to your acceptance of the License Agreement available at: https://openexchangerates.org/license/",
                "timestamp": 1442782809, // new Date(timestamp2 * 1000)
                "base": "USD",
                "rates": {
                    "AED": 3.672602,
                    "AFN": 64.349999,
                    "ALL": 122.2619,
                    "AMD": 481.117498,
                    "ANG": 1.788625,
                    "AOA": 134.971667,
                    "ARS": 9.386886,
                    "AUD": 1.391554,
                    "AWG": 1.793333,
                    "AZN": 1.05435,
                    "BAM": 1.732005,
                    "BBD": 2,
                    "BDT": 77.81331,
                    "BGN": 1.730728,
                    "BHD": 0.377264,
                    "BIF": 1552,
                    "BMD": 1,
                    "BND": 1.395413,
                    "BOB": 6.903,
                    "BRL": 3.944536,
                    "BSD": 1,
                    "BTC": 0.0043268765,
                    "BTN": 65.748833,
                    "BWP": 10.265313,
                    "BYR": 17492.25,
                    "BZD": 1.994625,
                    "CAD": 1.322861,
                    "CDF": 928.23,
                    "CHF": 0.969049,
                    "CLF": 0.024602,
                    "CLP": 678.826999,
                    "CNY": 6.3642,
                    "COP": 2984.776693,
                    "CRC": 532.853995,
                    "CUC": 1,
                    "CUP": 0.999813,
                    "CVE": 97.661159175,
                    "CZK": 23.96744,
                    "DJF": 177.346249,
                    "DKK": 6.605745,
                    "DOP": 45.21464,
                    "DZD": 105.5025,
                    "EEK": 13.862,
                    "EGP": 7.827097,
                    "ERN": 15.14,
                    "ETB": 20.8925,
                    "EUR": 0.885695,
                    "FJD": 2.15055,
                    "FKP": 0.643924,
                    "GBP": 0.643924,
                    "GEL": 2.449625,
                    "GGP": 0.643924,
                    "GHS": 3.918759,
                    "GIP": 0.643924,
                    "GMD": 39.04986,
                    "GNF": 7250.480098,
                    "GTQ": 7.65738,
                    "GYD": 205.930002,
                    "HKD": 7.750142,
                    "HNL": 21.88858,
                    "HRK": 6.741403,
                    "HTG": 52.736825,
                    "HUF": 274.995999,
                    "IDR": 14401.366667,
                    "ILS": 3.903464,
                    "IMP": 0.643924,
                    "INR": 65.829911,
                    "IQD": 1188,
                    "IRR": 29792.5,
                    "ISK": 126.635,
                    "JEP": 0.643924,
                    "JMD": 118.336,
                    "JOD": 0.708452,
                    "JPY": 120.0431,
                    "KES": 105.1733,
                    "KGS": 70.364899,
                    "KHR": 4094.974976,
                    "KMF": 435.574345,
                    "KPW": 900.09,
                    "KRW": 1169.796681,
                    "KWD": 0.301376,
                    "KYD": 0.821943,
                    "KZT": 276.516988,
                    "LAK": 8129.875098,
                    "LBP": 1507.826667,
                    "LKR": 140.502001,
                    "LRD": 86.080002,
                    "LSL": 13.320763,
                    "LTL": 3.029596,
                    "LVL": 0.62196,
                    "LYD": 1.365729,
                    "MAD": 9.667307,
                    "MDL": 19.78818,
                    "MGA": 3100.716699,
                    "MKD": 54.26506,
                    "MMK": 1080.8919,
                    "MNT": 1989.5,
                    "MOP": 7.98081,
                    "MRO": 314.9685,
                    "MTL": 0.683738,
                    "MUR": 35.4544,
                    "MVR": 15.294233,
                    "MWK": 558.399979,
                    "MXN": 16.64642,
                    "MYR": 4.22028,
                    "MZN": 43.159999,
                    "NAD": 13.31261,
                    "NGN": 199.0113,
                    "NIO": 27.56596,
                    "NOK": 8.168898,
                    "NPR": 105.19808,
                    "NZD": 1.562826,
                    "OMR": 0.384995,
                    "PAB": 1,
                    "PEN": 3.191684,
                    "PGK": 2.829525,
                    "PHP": 46.44499,
                    "PKR": 104.373301,
                    "PLN": 3.720762,
                    "PYG": 5500.111686,
                    "QAR": 3.641907,
                    "RON": 3.91234,
                    "RSD": 106.1959,
                    "RUB": 66.704179,
                    "RWF": 713.813879,
                    "SAR": 3.750362,
                    "SBD": 7.970769,
                    "SCR": 13.09119,
                    "SDG": 6.096075,
                    "SEK": 8.257494,
                    "SGD": 1.401018,
                    "SHP": 0.643924,
                    "SLL": 3745.3745,
                    "SOS": 640.056628,
                    "SRD": 3.2825,
                    "STD": 21486.275,
                    "SVC": 8.705825,
                    "SYP": 188.762998,
                    "SZL": 13.32661,
                    "THB": 35.6571,
                    "TJS": 6.4005,
                    "TMT": 3.501167,
                    "TND": 1.953314,
                    "TOP": 2.175127,
                    "TRY": 3.005583,
                    "TTD": 6.33692,
                    "TWD": 32.47088,
                    "TZS": 2169.483317,
                    "UAH": 21.82496,
                    "UGX": 3656.266667,
                    "USD": 1,
                    "UYU": 28.8211,
                    "UZS": 2607.944947,
                    "VEF": 6.31843,
                    "VND": 22472,
                    "VUV": 111.98625,
                    "WST": 2.613538,
                    "XAF": 578.500344,
                    "XAG": 0.0659295,
                    "XAU": 0.000879,
                    "XCD": 2.70102,
                    "XDR": 0.706841,
                    "XOF": 579.162184,
                    "XPD": 0.001638,
                    "XPF": 105.774187,
                    "XPT": 0.001016,
                    "YER": 215.133,
                    "ZAR": 13.31066,
                    "ZMK": 5253.075255,
                    "ZMW": 10.000825,
                    "ZWL": 322.322775
                }
            },
            liveMockDelta: {
                "disclaimer": "Exchange rates are provided for informational purposes only, and do not constitute financial advice of any kind. Although every attempt is made to ensure quality, NO guarantees are given whatsoever of accuracy, validity, availability, or fitness for any purpose - please use at your own risk. All usage is subject to your acceptance of the Terms and Conditions of Service, available at: https://openexchangerates.org/terms/",
                "license": "Data sourced from various providers with public-facing APIs; copyright may apply; resale is prohibited; no warranties given of any kind. Bitcoin data provided by http://coindesk.com. All usage is subject to your acceptance of the License Agreement available at: https://openexchangerates.org/license/",
                "timestamp": 1442674809, // new Date(timestamp2 * 1000)
                "base": "USD",
                "rates": {
                    "AED": 3.872579,
                    "AFN": 64.149999,
                    "ALL": 122.2834,
                    "AMD": 482.247498,
                    "ANG": 1.788625,
                    "AOA": 134.559334,
                    "ARS": 9.384124,
                    "AUD": 1.39062,
                    "AWG": 1.793333,
                    "AZN": 1.054475,
                    "BAM": 1.728336,
                    "BBD": 2,
                    "BDT": 77.74264,
                    "BGN": 1.728078,
                    "BHD": 0.377252,
                    "BIF": 1552.3675,
                    "BMD": 1,
                    "BND": 1.394828,
                    "BOB": 6.896763,
                    "BRL": 3.936275,
                    "BSD": 1,
                    "BTC": 0.0043292386,
                    "BTN": 65.786616,
                    "BWP": 10.265313,
                    "BYR": 17495.525,
                    "BZD": 1.992384,
                    "CAD": 1.320786,
                    "CDF": 927.42875,
                    "CHF": 0.967102,
                    "CLF": 0.024602,
                    "CLP": 678.826199,
                    "CNY": 6.36414,
                    "COP": 2976.925026,
                    "CRC": 532.390195,
                    "CUC": 1,
                    "CUP": 0.999813,
                    "CVE": 97.55034285,
                    "CZK": 23.91821,
                    "DJF": 177.346249,
                    "DKK": 6.591192,
                    "DOP": 45.17029,
                    "DZD": 105.4987,
                    "EEK": 13.786425,
                    "EGP": 7.826226,
                    "ERN": 15.14,
                    "ETB": 20.87316,
                    "EUR": 0.88469,
                    "FJD": 2.15055,
                    "FKP": 0.643864,
                    "GBP": 0.643864,
                    "GEL": 2.449625,
                    "GGP": 0.643864,
                    "GHS": 3.914463,
                    "GIP": 0.643864,
                    "GMD": 39.06876,
                    "GNF": 7334.340098,
                    "GTQ": 7.652121,
                    "GYD": 205.756502,
                    "HKD": 7.750043,
                    "HNL": 21.87002,
                    "HRK": 6.73265,
                    "HTG": 52.720137,
                    "HUF": 274.365399,
                    "IDR": 14381.216667,
                    "ILS": 3.899383,
                    "IMP": 0.643864,
                    "INR": 65.831111,
                    "IQD": 1182.345,
                    "IRR": 29792.5,
                    "ISK": 126.725,
                    "JEP": 0.643864,
                    "JMD": 118.2424,
                    "JOD": 0.708478,
                    "JPY": 119.8134,
                    "KES": 105.1986,
                    "KGS": 68.971899,
                    "KHR": 4087.507476,
                    "KMF": 433.651845,
                    "KPW": 900.09,
                    "KRW": 1167.290015,
                    "KWD": 0.30142,
                    "KYD": 0.82079,
                    "KZT": 275.568388,
                    "LAK": 8114.582598,
                    "LBP": 1505.27,
                    "LKR": 140.370601,
                    "LRD": 88.50885,
                    "LSL": 13.3182,
                    "LTL": 3.023125,
                    "LVL": 0.619692,
                    "LYD": 1.364634,
                    "MAD": 9.658435,
                    "MDL": 19.77346,
                    "MGA": 3099.585033,
                    "MKD": 54.21619,
                    "MMK": 1081.1081,
                    "MNT": 1989.5,
                    "MOP": 7.973654,
                    "MRO": 315.0315,
                    "MTL": 0.683602,
                    "MUR": 35.460438,
                    "MVR": 15.29355,
                    "MWK": 558.239379,
                    "MXN": 16.63407,
                    "MYR": 4.21973,
                    "MZN": 42.929999,
                    "NAD": 13.31056,
                    "NGN": 198.8639,
                    "NIO": 27.54214,
                    "NOK": 8.152256,
                    "NPR": 105.16868,
                    "NZD": 1.562751,
                    "OMR": 0.384988,
                    "PAB": 1,
                    "PEN": 3.188277,
                    "PGK": 2.829525,
                    "PHP": 46.43115,
                    "PKR": 104.268601,
                    "PLN": 3.713201,
                    "PYG": 5506.636686,
                    "QAR": 3.64204,
                    "RON": 3.905641,
                    "RSD": 106.0484,
                    "RUB": 66.594729,
                    "RWF": 712.385754,
                    "SAR": 3.750175,
                    "SBD": 7.972363,
                    "SCR": 13.08701,
                    "SDG": 6.088524,
                    "SEK": 8.237066,
                    "SGD": 1.398912,
                    "SHP": 0.643864,
                    "SLL": 3744.6255,
                    "SOS": 640.629003,
                    "SRD": 3.2825,
                    "STD": 21486.575,
                    "SVC": 8.696893,
                    "SYP": 188.762998,
                    "SZL": 13.32456,
                    "THB": 35.64949,
                    "TJS": 6.3825,
                    "TMT": 3.501167,
                    "TND": 1.950974,
                    "TOP": 2.174693,
                    "TRY": 3.004682,
                    "TTD": 6.33131,
                    "TWD": 32.44342,
                    "TZS": 2167.09165,
                    "UAH": 21.76875,
                    "UGX": 3650.746667,
                    "USD": 1,
                    "UYU": 28.79833,
                    "UZS": 2605.444947,
                    "VEF": 6.318442,
                    "VND": 22452.85,
                    "VUV": 112.24875,
                    "WST": 2.613538,
                    "XAF": 578.564544,
                    "XAG": 0.0659295,
                    "XAU": 0.000879,
                    "XCD": 2.70102,
                    "XDR": 0.706841,
                    "XOF": 579.219984,
                    "XPD": 0.001638,
                    "XPF": 105.529187,
                    "XPT": 0.001016,
                    "YER": 215.133,
                    "ZAR": 13.31527,
                    "ZMK": 5253.075255,
                    "ZMW": 9.990779,
                    "ZWL": 322.387247
                }
            }
        };
    }

    function setStoredLiveRates(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    function getFlagForCurrencyCode(code) {
        return 'img/ukflag.png';
    }

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

});


var tSep = " ";							// tousends separator
var dSep = ".";							// decimal separator

var DefaultStartCurrency = "GBP";
var DefaultConvertToCurrency = "EUR";
var CurrenciesURL = "currenciesJSON.json";
var CurrencyList = [
	{"Name":"GBP","Description":"British Pound","IsMajor":true,"Geography":"EU"},
	{"Name":"EUR","Description":"Euro","IsMajor":true,"Geography":"EU"},
	{"Name":"USD","Description":"US Dollar","IsMajor":true,"Geography":"Americas"},
	{"Name":"AUD","Description":"Australian Dollar","IsMajor":true,"Geography":"Americas"},
	{"Name":"CAD","Description":"Canadian Dollar","IsMajor":true,"Geography":"Americas"},
	{"Name":"CHF","Description":"Swiss Franc","IsMajor":true,"Geography":"EU"},
	{"Name":"CZK","Description":"Czech Republic Koruna","IsMajor":false,"Geography":"EU"},
	{"Name":"DKK","Description":"Danish Kroner","IsMajor":false,"Geography":"EU"},
	{"Name":"HKD","Description":"Hong Kong Dollar","IsMajor":false,"Geography":"Asia"},
	{"Name":"INR","Description":"Indian Rupee","IsMajor":false,"Geography":"Asia"},
	{"Name":"JPY","Description":"Japanese Yen","IsMajor":false,"Geography":"Asia"},
	{"Name":"NOK","Description":"Norwegian Krone","IsMajor":false,"Geography":"EU"},
	{"Name":"NZD","Description":"New Zealand Dollar","IsMajor":false,"Geography":"Asia"},
	{"Name":"PLN","Description":"Polish Zloty","IsMajor":false,"Geography":"EU"},
	{"Name":"SEK","Description":"Swedish Krona","IsMajor":false,"Geography":"EU"},
	{"Name":"SGD","Description":"Singapore Dollar","IsMajor":false,"Geography":"Asia"},
	{"Name":"THB","Description":"Thai Baht","IsMajor":false,"Geography":"Asia"},
	{"Name":"ZAR","Description":"South African Rand","IsMajor":false,"Geography":"Africa"},
	{"Name":"AED","Description":"United Arab Emirates Dirham","IsMajor":false,"Geography":"EU"},
	{"Name":"HUF","Description":"Hungarian Forinz","IsMajor":false,"Geography":"EU"},
	{"Name":"HRK","Description":"Croatian Kuna","IsMajor":false,"Geography":"EU"},
	{"Name":"TRY","Description":"Turkish Lira","IsMajor":false,"Geography":"EU"},
	{"Name":"MAD","Description":"Moroccan Dirham","IsMajor":false,"Geography":"Africa"},
	{"Name":"ILS","Description":"Israel Shekel","IsMajor":false,"Geography":"Asia"},
	{"Name":"MXN","Description":"Mexican Peso","IsMajor":false,"Geography":"Americas"},
	{"Name":"BHD","Description":"Bahraini Dinar","IsMajor":false,"Geography":"Asia"},
	{"Name":"XCD","Description":"East Carribean Dollar","IsMajor":false,"Geography":"Americas"},
	{"Name":"BBD","Description":"Barbados Dollar","IsMajor":false,"Geography":"Americas"},
	{"Name":"RUB","Description":"Russian Ruble","IsMajor":false,"Geography":"EU"},
	{"Name":"CNY","Description":"China Yuan Renminbi","IsMajor":false,"Geography":"Asia"},
	{"Name":"BSD","Description":"Bahamian Dollar","IsMajor":false,"Geography":"Americas"},
	{"Name":"KYD","Description":"Cayman Island Dollar","IsMajor":false,"Geography":"Americas"},
	{"Name":"GHS","Description":"Ghanaian Cedi","IsMajor":false,"Geography":"Africa"}
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
