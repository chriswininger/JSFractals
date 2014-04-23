/**
 * server.js
 * author: chris wininger
 * purpose: a simple server to let you navigate the fractal demos
 * in this project
**/

var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

var port = 3000,
    projectUrl = '/demos';

var app = new express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(projectUrl, express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    buildDirectory(function (err, projects) {
        if (err) return res.status(404).send('Not found');

        res.render('directory.jade', {
            demos: projects
        });
    });
});

app.listen(port);

console.info('server listening on port ' + port);

// --- Helper Function ---
function buildDirectory (complete) {
    var prjPath = __dirname + path.sep + 'public';

    var rtn = [];
    fs.readdir(prjPath, function (err, projects) {
        if (err) return complete(err, rtn);
        if (projects.length === 0) return complete(null, rtn);

        var _processed = _.after(projects.length, function () {
            complete(null, rtn);
        });

        _.each(projects, function (prj) {
            fs.stat(prjPath + path.sep + prj, function (err, stats) {
                if (err) return complete(err, rtn);

                if (stats.isDirectory()) {
                    fs.readdir(prjPath + path.sep + prj, function (err, files) {
                        if (err) complete(err, rtn);
                        if (_.contains(files, 'demo.json')) {
                            rtn.push({
                                title: prj,
                                url: projectUrl + '/' + prj + '/' + prj + '.html'
                            });
                        }
                        _processed();
                    });
                } else {
                    _processed();
                }


            });
        });
    });
}