var util = require('util'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    events = require('events');

var DEFAULT_PORT = 8099;
console.log('用于响应测试中出现的JS文件请求')

function main(argv) {
    new HttpServer({
        'GET': createServlet(StaticServlet),
        'POST': createServlet(StaticServlet),
        'HEAD': createServlet(StaticServlet)
    }).start(Number(argv[2]) || DEFAULT_PORT);
}

function escapeHtml(value) {
    return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}

function createServlet(Class) {
    var servlet = new Class();
    return servlet.handleRequest.bind(servlet);
}

/**
 * An Http server implementation that uses a map of methods to decide
 * action routing.
 *
 * @param {Object} Map of method => Handler function
 */
function HttpServer(handlers) {
    this.handlers = handlers;
    this.server = http.createServer(this.handleRequest_.bind(this));
}

HttpServer.prototype.start = function(port) {
    this.port = port;
    this.server.listen(port);

    console.log('\r\n************************************************************');
    console.log('Dev: Jalal Hejazi 2014 ');
    console.log('\r\nThis WebServer is made only with javascript :-)\r\n ');


    console.log('Simple Http Server running at http://localhost:' + port + '/ ');
    console.log('This WebServer support HTTP-GET and HTTP-POST ');

    console.log('To start on defaul port use>  node ./SimpleHTTPServer.js ');
    console.log('To start on port 1234   use>  node ./SimpleHTTPServer.js 1234 ');

    console.log('index.html is the default entry ');
    console.log('app/data/db.json is the default folder for any json data');
    console.log("To exit this server use <ctrl>+c ");


    console.log('\r\n************************************************************');



};

HttpServer.prototype.parseUrl_ = function(urlString) {
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('/', parsed.pathname);
    return url.parse(url.format(parsed), true);
};

HttpServer.prototype.handleRequest_ = function(req, res) {
    var logEntry = req.method + ' ' + req.url;
    if (req.headers['user-agent']) {
        logEntry += ' ' + req.headers['user-agent'];
    }
    console.log(logEntry);
    req.url = this.parseUrl_(req.url);
    var handler = this.handlers[req.method];
    if (!handler) {
        res.writeHead(501);
        res.end();
    } else {
        handler.call(this, req, res);
    }
};

/**
 * Handles static content.
 */
function StaticServlet() {}

StaticServlet.MimeMap = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',

};

StaticServlet.prototype.handleRequest = function(req, res) {
    var self = this;
    var path = ('./' + req.url.pathname).replace('//', '/').replace(/%(..)/g, function(match, hex) {
        return String.fromCharCode(parseInt(hex, 16));
    });
    var parts = path.split('/');
    if (parts[parts.length - 1].charAt(0) === '.')
        return self.sendForbidden_(req, res, path);

    if (req.method === 'POST') {
        if (self.attemptingToAccessOutsideLocalAppPath(parts)) {
            return self.sendForbidden_(req, res, path);
        }

        return self.writeFile_(req, res, path);
    }

    self.findAndSendTarget(req, path, res, self);
}

StaticServlet.prototype.findAndSendTarget = function(req, path, res, self) {
    fs.stat(path, function(err, stat) {

        if (err && path.indexOf('app/') >= 0)
            return self.sendMissing_(req, res, path);
        else if (err) {

            if (path.indexOf('.json') == -1) {
                return self.findAndSendTarget(req, path + ".json", res, self);
            }
            return self.sendDefault_(req, res);
        }

        if (fs.fileExistsSync(path + ".json")) {

            return self.findAndSendTarget(req, path + ".json", res, self);
        }

        var indexOfLastSlash = path.lastIndexOf('/');
        var indexOfSecondToLastSlash = path.lastIndexOf('/', indexOfLastSlash - 1);
        var secondToLastNode = path.substr(indexOfSecondToLastSlash + 1, indexOfLastSlash - indexOfSecondToLastSlash - 1);
        //        console.log(path);
        //        console.log(stat.isDirectory())
        if (stat.isDirectory() && secondToLastNode != "event" && secondToLastNode != "user") {
            if (path.indexOf('/data/') == -1) {
                return self.sendDefault_(req, res);
            }
            return self.sendAllJsonFilesAppended_(req, res, path);
        }
        return self.sendFile_(req, res, path);
    });
}

StaticServlet.prototype.attemptingToAccessOutsideLocalAppPath = function(pathParts) {
    if (pathParts[0] !== '.')
        return true;

    for (var idx = 0; idx < pathParts.length; idx++) {
        if (pathParts[idx].indexOf("..") != -1 || pathParts[idx].indexOf("c:\\") != -1 || pathParts[idx].indexOf("/c/") != -1) {
            return true;
        }
    }

    return false;
};

StaticServlet.prototype.sendError_ = function(req, res, error) {
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>Internal Server Error</title>\n');
    res.write('<h1>Internal Server Error</h1>');
    res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
    console.log('500 Internal Server Error');
    console.log(util.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function(req, res, path) {
    path = path.substring(1);
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>404 Not Found</title>\n');
    res.write('<h1>Not Found</h1>');
    res.write(
        '<p>The requested URL ' +
        escapeHtml(path) +
        ' was not found on this server.</p>'
    );
    res.end();
    console.log('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function(req, res, path) {
    path = path.substring(1);
    res.writeHead(403, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>403 Forbidden</title>\n');
    res.write('<h1>Forbidden</h1>');
    res.write(
        '<p>You do not have permission to access ' +
        escapeHtml(path) + ' on this server.</p>'
    );
    res.end();
    console.log('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendRedirect_ = function(req, res, redirectUrl) {
    res.writeHead(301, {
        'Content-Type': 'text/html',
        'Location': redirectUrl
    });
    res.write('<!doctype html>\n');
    res.write('<title>301 Moved Permanently</title>\n');
    res.write('<h1>Moved Permanently</h1>');
    res.write(
        '<p>The document has moved <a href="' +
        redirectUrl +
        '">here</a>.</p>'
    );
    res.end();
    console.log('301 Moved Permanently: ' + redirectUrl);
};

StaticServlet.prototype.sendDefault_ = function(req, res) {
    var self = this;
    var path = './index.html'

    var file = fs.createReadStream(path);
    res.writeHead(200, {
        'Content-Type': StaticServlet.
        MimeMap[path.split('.').pop()] || 'text/plain'
    });
    if (req.method === 'HEAD') {
        res.end();
    } else {
        file.on('data', res.write.bind(res));
        file.on('close', function() {
            res.end();
        });
        file.on('error', function(error) {
            self.sendError_(req, res, error);
        });
    }
};

StaticServlet.prototype.sendFile_ = function(req, res, path) {
    var self = this;
    var file = fs.createReadStream(path);
    res.writeHead(200, {
        'Content-Type': StaticServlet.
        MimeMap[path.split('.').pop()] || 'text/plain'
    });
    if (req.method === 'HEAD') {
        res.end();
    } else {
        file.on('data', res.write.bind(res));
        file.on('close', function() {
            res.end();
        });
        file.on('error', function(error) {
            self.sendError_(req, res, error);
        });
    }
};

StaticServlet.prototype.sendAllJsonFilesAppended_ = function(req, res, path) {
    var self = this;
    var files = []
    try {
        files = fs.readdirSync(path);
    } catch (e) {
        self.writeSuccessHeader(res, path);
        res.write("[]");
        res.end();
    }
    var results = "[";
    for (var idx = 0; idx < files.length; idx++) {
        if (files[idx].indexOf(".json") == files[idx].length - 5) {
            results += fs.readFileSync(path + "/" + files[idx]) + ",";
        }
    }
    results = results.substr(0, results.length - 1);
    results += "]";
    self.writeSuccessHeader(res, path);
    res.write(results);
    res.end();

};

StaticServlet.prototype.writeFile_ = function(req, res, path) {
    var self = this;

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    if (req.method === 'HEAD') {
        res.end();
    } else {
        var targetDir = path.substr(0, path.lastIndexOf('/'));
        var dirExists;
        try {
            var stats = fs.lstatSync(targetDir);
            dirExists = stats.isDirectory();
        } catch (e) { dirExists = false; }

        if (!dirExists) {
            fs.mkdirSyncRecursive(targetDir);
        }
        var writeStream = fs.createWriteStream(path + ".json");
        req.pipe(writeStream);

        req.on('end', function() {
            res.writeHead(200, { "content-type": "text/html" });
            //            res.end('<html><body>Save Successful</body></html>');
            res.end();
        });

        writeStream.on('error', function(err) {
            console.log(err);
            self.sendError_(req, res, err);
        });
    }
};

StaticServlet.prototype.writeSuccessHeader = function(res, path) {
    res.writeHead(200, {
        'Content-Type': StaticServlet.
        MimeMap[path.split('.').pop()] || 'text/plain'
    });
}
StaticServlet.prototype.sendDirectory_ = function(req, res, path) {
    var self = this;
    if (path.match(/[^\/]$/)) {
        req.url.pathname += '/';
        var redirectUrl = url.format(url.parse(url.format(req.url)));
        return self.sendRedirect_(req, res, redirectUrl);
    }
    fs.readdir(path, function(err, files) {
        if (err)
            return self.sendError_(req, res, error);

        if (!files.length)
            return self.writeDirectoryIndex_(req, res, path, []);

        var remaining = files.length;
        files.forEach(function(fileName, index) {
            fs.stat(path + '/' + fileName, function(err, stat) {
                if (err)
                    return self.sendError_(req, res, err);
                if (stat.isDirectory()) {
                    files[index] = fileName + '/';
                }
                if (!(--remaining))
                    return self.writeDirectoryIndex_(req, res, path, files);
            });
        });
    });
};

StaticServlet.prototype.writeDirectoryIndex_ = function(req, res, path, files) {
    path = path.substring(1);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    if (req.method === 'HEAD') {
        res.end();
        return;
    }
    res.write('<!doctype html>\n');
    res.write('<title>' + escapeHtml(path) + '</title>\n');
    res.write('<style>\n');
    res.write('  ol { list-style-type: none; font-size: 1.2em; }\n');
    res.write('</style>\n');
    res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
    res.write('<ol>');
    files.forEach(function(fileName) {
        if (fileName.charAt(0) !== '.') {
            res.write('<li><a href="' +
                escapeHtml(fileName) + '">' +
                escapeHtml(fileName) + '</a></li>');
        }
    });
    res.write('</ol>');
    res.end();
};

var path = require('path');

fs.fileExistsSync = function(filePath) {
    try {
        var stats = fs.lstatSync(filePath);

        return stats.isFile();
    } catch (e) {
        return false;
    }
}

fs.mkdirSyncRecursive = function(dirPath) {

    try {
        fs.mkdirSync(dirPath)
    } catch (e) {
        //Create all the parents recursively
        fs.mkdirSyncRecursive(path.dirname(dirPath));
        //And then the directory
        fs.mkdirSyncRecursive(dirPath);

    }

};

main(process.argv);