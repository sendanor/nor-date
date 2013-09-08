/* Helper functions */
(function(helpers, global) {
"use strict";

var is = (typeof require !== 'undefined') ? require('nor-is') : global && global.nor_is;

if(!is) { throw new TypeError("nor-date requires nor-is"); }

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
		labels = ['Jäljellä:', 'Loppui:'];
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
