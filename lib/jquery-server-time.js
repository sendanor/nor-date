/* Jquery HTTP NTP Client */
(function($){
	
	/** Assert that time is valid */
	function assert_time(t) {
		if(typeof t !== 'number') { throw new TypeError('time (' + t + ') is not number!'); }
		if(t <= 1378656286000) {
			throw new TypeError('time (' + t + ') is invalid!');
		}
	}
	
	/** Asynchronically get time offset between the client and server */
	$.getServerTimeOffset = function(url) {
		if(!url) { throw new TypeError("missing url for .getServerTimeOffset()!"); }

		var client_start_time;

		var p = $.ajax({
			url: url + '/time',
			cache: false,
			dataType: 'text',
			beforeSend: function() {
				client_start_time = (new Date()).getTime();
			}
		}).then(function(json) {
			var client_end_time = (new Date()).getTime();
			assert_time(client_start_time);
			assert_time(client_end_time);
			var id = JSON.parse(json);
			var p2 = $.ajax({
				url: url+'/fetch?id='+encodeURIComponent(id),
				dataType: 'text',
				cache: false
			}).then(function(json) {
				var data = JSON.parse(json);
				assert_time(data.start);
				assert_time(data.end);
				var offset = ( ( data.start - client_start_time ) + (data.end - client_end_time) ) / 2;
				return offset;
			});
			return p2;
		});

		return p;
	};

	/** The time offset on server */
	var _offset;
	$.resetServerTime = function(url) {
		return $.getServerTimeOffset(url).then(function(offset) { return _offset = offset; });
	};

	/** Get server time */
	$.getServerTime = function() {
		if(_offset === undefined) { throw new TypeError("You must call $.resetServerTime() first!"); }
		var time = new Date();
		time.setTime( (new Date()).getTime() + offset);
		return time;
	};

})( jQuery );
/* EOF */