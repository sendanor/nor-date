/** HTTP-based NTP implementation for Node.js and AJAX clients */
"use strict";

/** Build event handler for debuging */
/*
var util = require('util');
function debug_event_handler(name) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		var now = (new Date()).getTime();
		util.debug( '[' + now + '] ' + name + ' (' + args.map(function(a) { return util.inspect(a); }).join(', ') + ')' );
	};
}
*/

/* Get time in milliseconds */
function get_time() {
	return (new Date()).getTime();
}

/* Module builder */
function _request_creator(mod_opts) {
	mod_opts = mod_opts || {};

	var _path = mod_opts.path || '';
	var _id = 0;
	var _cache = {};

	/** */
	function _cache_has_id(id) {
		return Object.prototype.hasOwnProperty.call(_cache, id) ? true : false;
	}

	/** */
	function _cache_cleanup(id) {
		if(_cache_has_id(id)) {
			delete _cache[id];
		}
	}
	
	/** HTTP request runner */
	function request_handler(req, res) {
		var server_start_time = get_time();
		var cache, url, id;
		
		url = require('url').parse(req.url, true);
		
		if(url.pathname === _path + '/time') {
			_id = Math.floor(Math.random()*100000000000000000);
			cache = {'id':_id, 'start': server_start_time, 'end':undefined};
			_cache[_id] = cache;
			
			req.on('close', _cache_cleanup.bind(undefined, _id) );
			
			req.on('end', function() {
				cache.status = true;
				cache.end = get_time();
			});
			
			setTimeout(_cache_cleanup.bind(undefined, _id), 1000*30);
		
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(_id));
		} else if(url.pathname.substr(0, _path.length + 6) === _path + '/fetch') {
			id = parseInt(url.query.id, 10);
			if(_cache_has_id(id)) {
				res.writeHead(200, {'Content-Type': 'application/json'});
	
				res.end(JSON.stringify(_cache[id]));
				_cache_cleanup(id);
			} else {
				res.writeHead(404, {'Content-Type': 'application/json'});
				res.end(JSON.stringify("404 - Not Found"));
			}
		} else {
			res.writeHead(404, {'Content-Type': 'application/json'});
			res.end(JSON.stringify("404 - Not Found"));
		}
	}

	return request_handler;
}

// Exports
module.exports = _request_creator;

/* EOF */
