/** HTTP-based NTP implementation for Node.js and AJAX clients */
"use strict";

var util = require('util');
	
/** Build event handler for debuging */
function debug_event_handler(name) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		var now = (new Date()).getTime();
		util.debug( '[' + now + '] ' + name + ' (' + args.map(function(a) { return util.inspect(a); }).join(', ') + ')' );
	};
}
	
/* Get time in milliseconds */
function get_time() {
	return (new Date()).getTime();
}

/* Module builder */
function _request_creator(mod_opts) {
	mod_opts = mod_opts || {};
	//var _http = mod_opts.http || require('http');
	
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
		var cache, params, id;
		
		params = require('url').parse(req.url, true).query;
		
		if(req.url === '/time') {
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
		} else if(req.url.substr(0, 6) === '/fetch') {
			id = parseInt(params.id, 10);
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

	/** Create instance of NTP HTTP Server */
	/*
	function Server(opts) {
		opts = opts || {};
		this._server = http.createServer(request_handler);
		var port = opts.listen || opts.port;
		if(port) {
			this._server.listen(port);
		}
	}
	*/

	/** Returns the internal value of HTTP server */
	/*
	Server.prototype.server = function() {
		return this._server;
	};
	*/

	/** Start listening */
	/*
	Server.prototype.listen = function(host, port) {
		if(port === undefined) {
			port = host;
			host = undefined;
		}
		if(host === undefined) {
			this._server.listen(port);
		} else {
			this._server.listen(host, port);
		}
		return this;
	};
	*/
	
	/** Creates HTTP-based NTP server */
	/*
	Server.create = function(opts) {
		return new Server(opts);
	};
	*/

	/* Alias for `Server.create` */
	//Server.createServer = Server.create;

	return request_handler;
}

// Exports
module.exports = _request_creator;

/* EOF */
