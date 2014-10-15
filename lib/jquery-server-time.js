/* Jquery HTTP NTP Client */

/*global jQuery */

"use strict";
(function($){

	if(!$) { throw new TypeError("jquery required"); }

	var _server_offset = 0;

	/** Assert that time is valid */
	function assert_time(t) {
		if(typeof t !== 'number') { throw new TypeError('time (' + t + ') is not number!'); }
		if(t <= 1378656286000) {
			throw new TypeError('time (' + t + ') is invalid!');
		}
	}

	/** Get server offset */
	$.getServerTimeOffset = function() {
		return _server_offset;
	};

	/** Get server time */
	$.getServerTime = function() {
		var time = new Date();
		if(_server_offset === undefined) {
			return time;
		}
		time.setTime( time.getTime() - _server_offset );
		return time;
	};

	/** The time offset on server */
	$.resetServerTime = function(url, times) {
		times = times || 5;
		var i, p;
		function iter() {
			return $.testServerTime(url).then(function(r) {
				// FIXME: Check correct implementation from the RFC
				var fix1 = r.server.start /* t1 */ - (r.client.start /* t0 */ + r.rtd/2);
				var fix2 = r.server.end /* t2 */ - (r.client.end /* t3 */ + r.rtd/2);
				var fix = (fix1 + fix2) / 2;
				console.log('server='+ r.server.start + ' versus client=' + r.client.start + ' offset ' + fix + ' (rtd='+r.rtd+')');
				_server_offset -= fix;
				return r;
			});
		}
		p = iter();
		function call_iter() {
			return iter();
		}
		for(i=0; i<times-1; i += 1) {
			p = p.then(call_iter).fail(call_iter);
		}
		return p;
	};

	/** Asynchronically get time offset between the client and server */
	$.testServerTime = function(url) {
		if(!url) { throw new TypeError("missing url for .testServerTime()!"); }

		var client_start_time;

		var p = $.ajax({
			url: url + '/time',
			cache: false,
			dataType: 'text',
			beforeSend: function() {
				client_start_time = $.getServerTime().getTime();
			}
		}).then(function(json) {
			var client_end_time = $.getServerTime().getTime();
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

				var t0 = client_start_time;
				var t1 = data.start;
				var t2 = data.end;
				var t3 = client_end_time;

				var rtd = (t3-t0) - (t2-t1);
				var offset = ((t1-t0) + (t2-t3)) / 2;

				var res = {
					client:{
						start: client_start_time,
						end: client_end_time
					},
					server:{
						start: data.start,
						end: data.end
					},
					rtd: rtd,
					offset: offset
				};
				return res;
			});
			return p2;
		});

		return p;
	};

})( typeof jQuery !== 'undefined' ? jQuery : (typeof require !== 'undefined' ? require('jquery') : undefined) );
/* EOF */
