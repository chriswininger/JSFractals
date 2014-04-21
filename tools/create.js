#!/usr/bin/env node
var fs = require('fs'),
	path = require('path');

if (process.argv.length < 3) {
	console.log('usage: create <args> [name]');
	console.log('--dir, -d specify a sub-folder to create the project inside')
    process.exit(1);
}

var templates = {
	html: {
		extension: 'html',
		path: __dirname + '/templates/template.html'
	},
	js: {
		extension: 'js',
		path: __dirname + '/templates/template.js'
	},
	css: {
		extension: 'css',
		path: __dirname + '/templates/template.css'
	}
};

var title = null,
    root = null;

var args = process.argv.slice(2), arg;
while (args.length) {
    arg = args.shift();
    switch (arg) {
        case '--dir':
        case '-d':
            root = requiredArg();
            break;
        default:
            title = arg;
    }
}

var	dir = process.cwd() +  (!!root ? path.sep + root : '') + path.sep + title,
    pathHTMLOut = dir + path.sep + title + '.' + templates.html.extension,
    pathJSOut = dir + path.sep + title + '.' + templates.js.extension,
    pathCSSOut = dir + path.sep + title + '.' + templates.css.extension ;

console.log('creating directory ' + dir);
fs.mkdir(dir, function (err) {
	if (err) endOnError('error creating directory: ' + err);

    fs.readFile(templates.html.path, function (err, htmlTemplate, complete) {
        if (err) endOnError();

        htmlTemplate = htmlTemplate.toString().replace(/#\[fileName\]/g, title);
        console.info('creating html file ' + pathHTMLOut);
        fs.writeFile(pathHTMLOut, htmlTemplate, function (err) {
            if (err) endOnError('error creating html file: ' + err);
            console.info('creating java script file ' + pathJSOut);
            copy(templates.js.path, pathJSOut, function (err) {
                if (err) endOnError(err);
                console.info('creating style sheet file ' + pathCSSOut);
                copy(templates.css.path, pathCSSOut, function (err) {
                    if (err) endOnError(err);
                    endOnSuccess();
                });
            });
        });
    });

});

function copy (source, dest, complete) {
    var rs = fs.createReadStream(source),
        ws = fs.createWriteStream(dest);

    rs.on('error', function (err) {
       complete(err);
    });
    ws.on('error', function (err) {
       complete(err);
    });
    ws.on("close", function(ex) {
        complete();
    });

    rs.pipe(ws);
}

function endOnError (err) {
    console.error(err);
    process.exit(1);
}

function endOnSuccess () {
    console.info('project created!');
    process.exit(0);
}

function requiredArg() {
    if (args.length) return args.shift();
    endOnError(arg + ' requires an argument');
}