/* Helper functions */
(function(helpers, global) {
"use strict";

var is = (typeof require !== 'undefined') ? require('nor-is') : global && global.nor_is;
if(!is) { throw new TypeError("nor-date requires nor-is"); }

var _current_locale = 'en';

var _locales = {
	// Defaults
	"$def": {
		"title": 'Default locale',
		"days_short": [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
		"days_long":  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
		"months_short": [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		"months_long": [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
		"format_date": "%D",
		"format_time": "%H:%M:%S",
		"format_datetime": "%a %b %e %H:%M:%S %Y"
	}
};

/** Get locale by name */
function _getLocale(name) {
	return _locales[name] || _locales.$def;
}

/** Copy locales */
function _setup_locale(name, parent_name, opts) {

	/** Copy objects */
	function copy_obj(obj) {
		// FIXME: This is not the best way to copy an object.
		return JSON.parse(JSON.stringify(obj));
	}

	var obj = copy_obj(_locales[parent_name]);
	opts = copy_obj(opts);
	Object.keys(_locales.$def).forEach(function(key) {
		obj[key] = opts[key] || obj[key] || _locales.$def[key];
	});
	return _locales[name] = obj;
}

_setup_locale("en", "$def", {
	"title": "English locale"
});

_setup_locale("fi", "$def", {
	"title": "Finnish locale",
	"days_short": [ 
		'su', 'ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'
	],
	"days_long":  [
		'sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'
	],
	"months_short": [
		'tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'
	],
	"months_long": [
		'tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'
	],
	"format_date": "%d.%m.%Y",
	"format_time": "%H:%M:%S",
	"format_datetime": "%d.%m.%Y %H:%M:%S"
});

/** Format digit with leading zero */
function with_leading_zero(d) {
	d = ''+d;
	return d.length === 1 ? '0' + d : d;
}

var _format_mapping = {
	// Day
	'a': function() { return _getLocale(this.getLocaleName()).days_short[ this.getDay() ]; },
	'A': function() { return _getLocale(this.getLocaleName()).days_long[ this.getDay() ]; },
	'd': function() { var d = this.getFormat('%{date}'); return with_leading_zero(d); },
	'e': function() { return '' + this.getFormat('%{date}'); },
	'j': function() { return '%j'; }, // TODO: Day of the year, 001-366
	'u': function() { var d = this.getDay(); return (d === 0) ? '7' : ''+d; },
	'w': function() { var d = this.getDay(); return (d === 7) ? '0' : ''+d; },

	// Week
	'U': function() { return '%U'; }, // TODO: The number of week
	'V': function() { return '%V'; }, // TODO: ISO-8601:1988 week number of the given year
	'W': function() { return '%W'; }, // TODO: A numeric representation of the week of the year

	// Month
	'b': function() { return _getLocale(this.getLocaleName()).months_short[ this.getMonth() ]; },
	'B': function() { return _getLocale(this.getLocaleName()).months_long[ this.getMonth() ]; },
	'h': function() { return this.getFormat('%b'); },
	'm': function() { var d = this.getFormat('%{month}'); return (d.length === 1) ? '0'+d : d;},

	// Year
	'C': function() { return Math.floor(this.getFullYear()/100); },
	'g': function() { return '%g'; }, // TODO: %g Two digit representation of the year going by ISO-8601:1988 standards
	'G': function() { return '%G'; }, // TODO: %G The full four-digit version of %g
	'y': function() { return this.getFormat('%Y').substr(2, 2); },
	'Y': function() { return ''+ this.getFullYear(); },

	// Time
	'k': function() { return this.getHours(); },
	'H': function() { return with_leading_zero(this.getFormat('%k')); },
	'l': function() { var d = (this.getHours() % 12); return d===0 ? 12 : d; },
	'I': function() { return with_leading_zero(this.getFormat('%l'));},
	'M': function() { return with_leading_zero(this.getMinutes()); },
	'p': function() { return this.getHours() >= 12 ? 'PM' : 'AM'; },
	'P': function() { return this.getHours() >= 12 ? 'pm' : 'am'; },
	'r': function() { return this.getFormat('%I:%M:%S %p'); },
	'R': function() { return this.getFormat('%H:%M'); },
	'S': function() { return with_leading_zero(this.getSeconds()); },
	'T': function() { return this.getFormat('%H:%M:%S');},
	'X': function() { return this.getFormat(_getLocale(this.getLocaleName()).format_time); }, // FIXME: Implement other locales
	'z': function() { return this.getFormat('%{timezone:offset}'); },
	'Z': function() { return '%Z'; }, // TODO: %Z The time zone abbreviation.

	// Time and Date stamps
	'c': function() { return this.getFormat(_getLocale(this.getLocaleName()).format_datetime); },
	'D': function() { return this.getFormat('%m/%d/%y'); },
	'F': function() { return this.getFormat('%Y-%m-%d');},
	's': function() { return Math.floor(this.getTime() / 1000); },
	'x': function() { return this.getFormat(_getLocale(this.getLocaleName()).format_date); },

	// Miscellaneous
	'n': function() { return '\n'; },
	't': function() { return '\t'; },
	'%': function() { return '%'; },

	// JavaScript methods
	'{date}': Date.prototype.getDate,
	'{day}': Date.prototype.getDay,
	'{year}': Date.prototype.getFullYear,
	'{hours}': Date.prototype.getHours,
	'{milliseconds}': Date.prototype.getMilliseconds,
	'{minutes}': Date.prototype.getMinutes,
	'{month}': function() { return this.getMonth()+1; },
	'{js:month}': Date.prototype.getMonth,
	'{seconds}': Date.prototype.getSeconds,
	'{time}': Date.prototype.getTime,
	'{timezone:offset}': Date.prototype.getTimezoneOffset,
	'{string}': function() { return this.toDateString()+' '+this.toTimeString(); },
	'{string:date}': Date.prototype.toDateString,
	'{string:time}': Date.prototype.toTimeString,
	'{year:short}': Date.prototype.getYear,
	'{utc:date}': Date.prototype.getUTCDate,
	'{utc:day}': Date.prototype.getUTCDay,
	'{utc:year}': Date.prototype.getUTCFullYear,
	'{utc:hours}': Date.prototype.getUTCHours,
	'{utc:milliseconds}': Date.prototype.getUTCMilliseconds,
	'{utc:minutes}': Date.prototype.getUTCMinutes,
	'{utc:month}': Date.prototype.getUTCMonth,
	'{utc:seconds}': Date.prototype.getUTCSeconds,
	'{utc}': Date.prototype.toUTCString,
	'{iso}': Date.prototype.toISOString,
	'{json}': Date.prototype.toJSON
};

/** Setup new locale */
helpers.setupLocale = _setup_locale.bind(undefined);

/** Set current locale name */
helpers.setCurrentLocale = function(name) {
	_current_locale = name;
	return helpers;
};

/** Format time */
helpers.format = function() {
	var format_str, opts, time;
	var args = Array.prototype.slice.call(arguments);
	args.map(function(arg) {
		if(is.string(arg)) {
			format_str = arg;
			return;
		}
		if(is.objOf(arg, Date)) {
			time = arg;
			return;
		}
		if(is.obj(arg)) {
			opts = arg;
			return;
		}
	});

	// Parse opts
	opts = opts || {};
	opts.locale = opts.lang || opts.locale || _current_locale;

	// Parse format string
	format_str = '' + ( format_str || opts.format || '' );

	// Parse time
	if(is.undef(time)) {
		time = new Date();
	}
	if(!is.objOf(time, Date)) {
		throw new TypeError(typeof time + ' is not instance of Date');
	}

	function do_match(match, tag, offset, str) {
		var t = new Date();
		t.setTime( time.getTime() );
		t.getLocaleName = function() {
			return opts.locale;
		};
		t.getFormat = function(o) {
			o.locale = o.lang || o.locale || opts.locale;
			return helpers.format(o, t);
		};

		//require('util').debug( require('util').inspect(match) );
		//require('util').debug( require('util').inspect(tag) );
		//require('util').debug( require('util').inspect(offset) );
		//require('util').debug( require('util').inspect(str) );

		if(Object.prototype.hasOwnProperty.call(_format_mapping, tag) && ( typeof _format_mapping[tag] === 'function' ) ) {
			return _format_mapping[tag].call(t);
		}
		return '%'+tag;
	}

	var find = '%([a-zA-Z0-9]|{[^\}]+})';
	var re = new RegExp(find, 'g');
	return format_str.replace(re, do_match);
};

/* Get current time */
helpers.now = function() {
	return new Date();
};

/** Get time since `time` and `now` as a long human readable string */
helpers.longSince = function(time, now) {
	if(!time) { throw new TypeError("bad arguments"); }
	now = now || new Date();

	var secs = Math.abs(Math.floor( (now.getTime()/1000) - (time.getTime()/1000) ));
	var mins = Math.floor(secs/60);
	var hours = Math.floor(mins/60);
	mins -= hours*60;
	secs -= hours*3600 + mins*60;
	var items = [
		[hours, 'tuntia'],
		[mins, 'minuuttia'],
		[secs, 'sekuntia']
	];
	items = items.filter(function(item) {
		return (item[0] !== 0) ? true : false;
	}).map(function(item) {
		return item.join(' ');
	});
	items.push( (now.getTime() < time.getTime()) ? 'jäljellä' : 'sitten' );
	return items.join(' ');
};

/** Get time since `time` and `now` as a short human readable string */
helpers.since = function(time, now, labels) {

	if(!time) { throw new TypeError("bad arguments"); }


	function d(n) {
		return ((''+n).length === 1) ? '0'+n : n;
	}


	if(is.array(now)) {
		labels = now;
		now = undefined;
	}

	now = now || new Date();

	if(!is.array(labels)) {
		labels = ['', 'Loppui '];
	}

	if(labels.length < 2) { throw new TypeError("bad arguments: labels too few"); }

	var bid_active = (now.getTime() < time.getTime()) ? true : false;

	var secs = Math.abs(Math.floor( (now.getTime()/1000) - (time.getTime()/1000) ));
	var mins = Math.floor(secs/60);
	var hours = Math.floor(mins/60);
	mins -= hours*60;
	secs -= hours*3600 + mins*60;
	var items = [];

	items.push( (bid_active) ? (labels[0]) : (labels[1]) );

	if(bid_active) {
		if(hours > 0) { 
			items.push(hours, 'h', d(mins), 'min', d(secs), 's' );
		} else if(mins > 0) {
			items.push(mins, 'min', d(secs), 's'); 
		} else if(secs > 0) {
			items.push(secs, 's');
		}
	} else {
		items.push( time.getDate() + '.' + (1+time.getMonth()) + '.' + time.getFullYear(), 'klo', time.getHours() + ':' + time.getMinutes() );
	}

	return items.join(' ');
};

}( (typeof module === 'undefined') ? (this.nor_date = {}) : (module.exports={}) , this ));
/* EOF */
