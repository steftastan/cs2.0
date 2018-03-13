import $ from 'jquery';
import './global.languages.js';
import './global.config.env.js';
var numeral = require('numeral');

/**
 * HELPER FUNCTION LIBRARY.
 * A library of global functions dedicated to general tasks.
 *
 * Please document every new function that is added here, and keep
 * this use strictly for global helper functions only.
 *
 * What can be considered a global helper, ask yourself the following questions:
 *
 * 1) Does my code need to be used in two or more components of my application?
 * 2) Did I have to copy and paste a block of code onto another component?
 *
 * If your answer to those 2 questions is yes, then put your code here, and bind it
 * to your components as a function, now it'll be available everywhere!
 *
 */

/**
 * Set the language of the user's choice.
 * @param language [String] the selected language
 */
export function SetLanguage(language) {
	$.ajax({
		url: global.endpoints[global.env].SESSION,
		method: 'PUT',
		cache: false,
		data: JSON.stringify({language: language}),
		success: function(data, status) {
			window.location.reload();
		},
		error: function(xhr, status, err) {
			console.error(xhr, status, err.toString());
		}
   });
}

/**
 * Update the company stored in the user's profile
 * @param fileName [String] the selected company
 */
export function SetCompany(fileName) {
	$.ajax({
		url: global.endpoints[global.env].SESSION,
		method: 'PUT',
		cache: false,
		data: JSON.stringify({fileName: fileName}),
		success: function(data, status) {
			window.location.reload();
		},
		error: function(xhr, status, err) {
			console.error(xhr, status, err.toString());
		}
   });
}

/**
 * These  functions allow us to handle links in various scenenarios
 */
export function HandleWebFacingLink(link) {
	 window.open(global.paths[global.env].SERVLET_LINK + link + "&turnCacheOff=" + (new Date()).getTime(), "appa", "scrollbars=yes,status=1,resizable=yes,menubar=0,screenX=0,screenY=0,left=0,top=0,width=" + (window.availWidth-10) + ",height=" + (window.availHeight-50));
};

export function HandlePopupLink(link, windowName, width, height) {
	windowName = windowName ? windowName : '';
	width = width ? width : 1024;
	height = height ? height : 768;
	window.open(global.paths[global.env].SERVLET_LINK + link, windowName, "height=" + height + ",width=" + width + ",resizeable=yes,menubar=0,toolbar=0,location=0,directories=0,scrollbars=1,status=0");
};

export function HandleRegularLink(link) {
	if (link.indexOf("react") !== -1) {
		/* Build link with /react/ portion in the URL (for pages made with the new Common Sense) */
		window.location.href = global.paths[global.env].BASE_URL+link;
	} else {
		/* Build link wih /servlet/ portion in the URL (Old Common Sense compatible)*/
		window.location.href = global.paths[global.env].SERVLET_LINK+link;
	}
};

 /**
   * Retrieve and process data for any widget in the GenericComponent file.
   * @param key [Integer] React's internal variable to identify items in an array.
   * @param widget [Object] The widget's configuration as it appears in the options constant.
   * @param cb [Function] A call back function that allows us to return data within the scope of the asynchronous function.
   */
export function GetWidget(key, widget, filters, cb) {

	var endPoint = (widget.endpoint ? widget.endpoint : '')+(filters ? filters : '');

	console.log(endPoint);

	 /* Polyfill because IE does not support Object.values function */
  	 const valuesPolyfill = function values (object) {
  		 return Object.keys(object).map(key => object[key]);
  	 };

  	 const values = Object.values || valuesPolyfill;

	 if (widget.data && widget.data.length) {
	
	 }

  	 $.getJSON(widget.endpoint, function(data) {
  		 // Process data, some of it may be the value pertaining to a results property.
  		 // Additionally, some data may or be not already be in array format. We tranform it to ensure we always return an Array.
  		 data = data.hasOwnProperty('results') ? data.results : data;
  		 data = (!(data instanceof Array)) ?  values(data) : data;
  		 cb(key, data, widget);
  	 });
}

 /**
  * Localization function, takes in key and returns its matching test in the current active language.
  * @param entry [String], a string of code that represents the key in our translation object.
  * The formar per dictionary entry is as follows:
  *
  * "dashboard" : ["Dashboard", "Tableau de Bord"],
  *
  * Where the key is the camelCase-format value represented by dictionary_entry.
  * key[0] must always be the english version.
  * key[1] must always be the french version.
  *
  * This format also makes it easier add new languages by creating one more element in the array
  * and adding the the logic in the Localization() function accordingly.
  *
  * USAGE:
  * To translate any given string on the page, follow these steps:
  * 1) Ensure an entry exists in the dictionary, following the format described above.
  * 2) Create a variable where you'll be storing the value returned by the Localization()
  * function. This variable *MUST* have the suffix __text (two underscores), this is so we
  * can easily find what is getting translated.
  * 3) Print the variable__text as you normally would.
  *
  */
 export function Localization(entry, lang) {
     var translation;
     var phrase;
	 var dictionary_entry;
     var defaultLang = lang ? lang : 'en_CA';

     if (entry && typeof entry === 'string') {

         dictionary_entry = Camelize(entry.trim());

         phrase = global.languages[dictionary_entry];

         if (phrase) {
             if (defaultLang === 'en_CA') {
                 translation = phrase[0];
             } else if (defaultLang === 'fr_CA') {
                 translation = phrase[1];
             }
         } else {
			 /* Default to the text sent via parameter if no translation is available */
			 translation = entry;
         }

     } else {
		 translation = entry;
	 }
     return translation;
 }

 /**
  * Converts any given string to camelCase, in order to match tke
  * key values in the languages dictionary.
  * It also changes any ampersands to the literal word 'and'
  * Replaces hyphens for spaces to allow  words to be camelCased.
  * Removes parentheses, hyphens, slashes and dots.
  *
  * @param firstLetterUpper {boolean} Flag that specifies if the first letter should be kept uppercase or not.
  * This is useful in the scenario where we build our routes in App.js
  * If not specified, always lowercase the letter.
  */
 export function Camelize(str, firstLetterUpper) {
	if (str.indexOf(' ') !== -1) str = str.toLowerCase();
    return str.replace(/&/g, "and")
		.replace(/-/g, " ")
		.replace(/[()-/.]/g, "")
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			if (index === 0 && !firstLetterUpper) {
				return letter.toLowerCase();
			} else {
				return letter.toUpperCase();
			}
		}).replace(/\s+/g, '');
 }

 /**
  * Replaces spaces and special characters to hyphens
  * Use this to build URL friendly strings.
  * Example input: "Hello this is a test"
  * Example output: "hello-this-is-a-test"
  */
 export function Hyphenize(myStr) {
    myStr = myStr.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
    if(myStr.charAt(0) === '-') {
        myStr = myStr.replace('-','/');
    }
    return myStr;
 }

/**
 * This function checks the device the site is currently being viewed on.
 * Received no parameters, returns a boolean value.
 *
 * true - the website is being viewed from a mobile device.
 * false - the website is being viewed from either desktop or iPad.
 */
export function WhichDevice() {
    var device = '';
    var ua = navigator.userAgent;

    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        if (window.matchMedia("only screen and (min-device-width : 768px) and (max-device-width : 1024px)").matches) {
            device = 'tablet';
        } else {
            device = 'mobile';
        }
    } else {
        device = 'desktop';
    }

    return device;
}

/**
 * Transform an RGB code to RGBA and apply the specified opacity
 * @param color [String] the color to be converted.
 * @param opacity [Number] The desired opacity to be aplied, must be a decimal from 0 to 1.
 */
export function ConvertRgbToRgba(color, opacity) {
    color = color.replace("rgb", "rgba").replace(')', ', '+opacity+')');
    return color;
}


/**
 * Format numerical data using numeral.js
 * http://numeraljs.com/#use-it
 *
 * The Cell and Row parameters are required by the BootStrap table.
 * Cell represents the value we want to format.
 * @param cell Value stored in an individual cell. Its type depends on the stored value.
 * @param row  [Object] An entire row of data.
 * @param type [String] The column's type as specified in the configuration file for that specific widget.
 * @returns Properly-formatted cell, or the original cell value if no formatting was made.
 *
 * Add more formatting options by adding new cases to the switch.
 */
export function DataFormatter(cell, row, type) {
	switch(type) {
	    case 'currency':
	        cell = numeral(cell).format('$0,0.00');
	        break;
	}

	return cell;
}
