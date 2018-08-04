var http = require("http");
var fs = require('fs');
var url = require('url');
var path=require('path');

var mine = {
	"css": "text/css",
	"gif": "image/gif",
	"html": "text/html",
	"ico": "image/x-icon",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"js": "text/javascript",
	"json": "application/json",
	"pdf": "application/pdf",
	"png": "image/png",
	"svg": "image/svg+xml",
	"swf": "application/x-shockwave-flash",
	"tiff": "image/tiff",
	"txt": "text/plain",
	"wav": "audio/x-wav",
	"wma": "audio/x-ms-wma",
	"wmv": "video/x-ms-wmv",
	"xml": "text/xml"
};
var port = 3000;
var app = "chaoba";

var trackingKeys = ["key", "entity", "topic", "event", "extend", "duration", "source",
	"exten_info",
	// "url", "loanUrl",
	"subsite", "firstlogin"];
getUrlQuery = function(name, queryString) {
	var targetQuery = queryString || window.location.search;
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = targetQuery.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}
var consoleTracking = function(url) {
	var startStr = "/g/" + app + "/";
	if(!url || !url.startsWith(startStr)) return;

	var key = url.split("?")[0].split(startStr)[1];
	var str = new Date().toTimeString() + " Tracking --> key:" + key;
	// for(var i = 0; i < logKeys.length; i++) {
	//   obj[logKeys[i]] && ( str += " ," + logKeys[i] + ": " + obj[logKeys[i]]);
	// }
	trackingKeys.map(tKey => {
		var value = getUrlQuery(tKey, url);
		value && (str += (", " + tKey + ":" + value));
	})
	console.log(str["green"]);
}

http.createServer(function(request, response) {

	var pathname = url.parse(request.url).pathname;
	if(pathname == "/") {
		pathname+="index.html";
	}
	var realPath = path.join(process.cwd(), pathname);

	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';
	fs.exists(realPath, function (exists) {
		if (!exists) {
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});

			response.write("This request URL " + pathname + " was not found on this server.");
			response.end();
		} else {
			fs.readFile(realPath, "binary", function (err, file) {
				if (err) {
					response.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					response.end(err);
				} else {
					var contentType = mine[ext] || "text/plain";
					response.writeHead(200, {
						'Content-Type': contentType
					});
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
}).listen(port, '0.0.0.0');

console.log('Server running at http://127.0.0.1:' + port + '/');