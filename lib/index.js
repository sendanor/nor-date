/* Helper functions */

var is = require('nor-is');
var helpers = module.exports = {};

/* Get current time */
helpers.now = function() {
	return new Date();
};

/** Get time since `time` and `now` as a long human readable string */
helpers.longSince = function(time, now) {
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
	function d(n) {
		return ((''+n).length === 1) ? '0'+n : n;
	}


	if(is.array(now)) {
		labels = now;
		now = undefined;
	}

	now = now || new Date();

	if(!is.array(labels)) {
		labels.push('Jäljellä: ', 'Mennyt: ');
	}

	var secs = Math.abs(Math.floor( (now.getTime()/1000) - (time.getTime()/1000) ));
	var mins = Math.floor(secs/60);
	var hours = Math.floor(mins/60);
	mins -= hours*60;
	secs -= hours*3600 + mins*60;
	var items = [];
	items.push( (now.getTime() < time.getTime()) ? (labels[0]) : (labels[1]) );

	if(hours > 0) { items.push(hours, ':', d(mins), ':', d(secs) ); }
	else if(mins > 0) { items.push(mins, ':', d(secs)); }
	else if(secs > 0) { items.push(secs, ' s'); }

	return items.join('');
};

/* EOF */
