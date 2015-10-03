"use strict";

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    PORT = process.argv[2] || 1234;

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "json": "text/javascript",
    "pdf": "application/pdf",
    "css": "text/css",
    "woff": "application/font-woff"
};

var routing = function () {
        var directories = [
            process.cwd()
        ];

    return function (req, res) {
        var uri = url.parse(req.url).pathname,
            filename = "";

        if (uri === '/' && req.method == 'GET') {
            uri = "/index.html";
        }

        for (var directoryIndex = 0; directoryIndex < directories.length; directoryIndex++) {
            filename = path.join(directories[directoryIndex], unescape(uri));
            if (fs.existsSync(filename) && fs.lstatSync(filename).isFile()) {
                break;
            } else {
                filename = "";
            }
        }

        if (filename) {
            var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
            if (mimeType === 'application/pdf') {
                res.writeHead(200, {'Content-Type': 'application/octet-stream'});
            } else {
                res.writeHead(200, {'Content-Type': (mimeType || 'text/plain') + '; charset=utf-8'});
            }

            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        } else {
            res.writeHead(404);
        }
        res.end();
    }
};

http.createServer(routing(false)).listen(PORT);
console.log("web server start on port: " + PORT + " for directory " + process.cwd());