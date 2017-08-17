var q = require('q');
var app = require("../../express");
const https = require('https');
var articleModel = require("../model/article/article.model.server");

app.get("/api/search/:searchKeyword", searchArticle);
app.get("/api/details/:nodeId", articleDetails);
app.get("/api/wiki/:nodeId", getWikiDetails);
app.get("/api/wikiText/:wikiId", getWikiText);
app.get("/api/contributor/:nodeId", getContributor);

var apiToken = process.env.OSF_API_TOKEN;


function searchArticle(req, res) {
    var searchKeyword = req.params.searchKeyword;

    osfSearchQuery(searchKeyword)
        .then(function (response) {
            res.json(response);
        }, function(error) {
            res.sendStatus(404).send(error);
        });
}

function articleDetails(req, res) {
    var nodeId = req.params.nodeId;

    osfDetails(nodeId)
        .then(function (response) {
            res.json(response);
        }, function(error) {
            res.sendStatus(404).send(error);
        });
}

function getWikiDetails(req, res) {
    var nodeId = req.params.nodeId;

    wikiDetails(nodeId)
        .then(function (response) {
            res.json(response);
        }, function(error) {
            res.sendStatus(404).send(error);
        });
}

function getWikiText(req, res) {
    var wikiId = req.params.wikiId;

    wikiText(wikiId)
        .then(function (response) {
            res.json(response);
        }, function(error) {
            res.sendStatus(404).send(error);
        });
}

function getContributor(req, res) {
    var nodeId = req.params.nodeId;
    contributorDetails(nodeId)
        .then(function (response) {
            res.json(response);
        }, function(error) {
            res.sendStatus(404).send(error);
        });
}



function osfSearchQuery(searchKeyword) {
    var deferred = q.defer();
    https.get({
        hostname: 'api.osf.io',
        path: '/v2/nodes/?filter[title]=' + searchKeyword,
        headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer' + apiToken
        }
    }, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            try {
                // body = JSON.parse(body);
                deferred.resolve(body);
            } catch (e) {
                deferred.reject({error: e});
            }

        });
    });
    return deferred.promise;
}

function osfDetails(nodeId) {
    var deferred = q.defer();
    https.get({
        hostname: 'api.osf.io',
        path: '/v2/nodes/' + nodeId + "/",
        headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer' + apiToken
        }
    }, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            try {
                // body = JSON.parse(body);
                deferred.resolve(body);
            } catch (e) {
                deferred.reject({error: e});
            }

        });
    });
    return deferred.promise;
}

function contributorDetails(nodeId) {
    var deferred = q.defer();
    https.get({
        hostname: 'api.osf.io',
        path: '/v2/nodes/' + nodeId + "/contributors/",
        headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer' + apiToken
        }
    }, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            try {
                deferred.resolve(body);
            } catch (e) {
                deferred.reject({error: e});
            }

        });
    });
    return deferred.promise;
}


function wikiDetails(nodeId) {
    var deferred = q.defer();
    https.get({
        hostname: 'api.osf.io',
        path: '/v2/nodes/' + nodeId + "/wikis/",
        headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer' + apiToken
        }
    }, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            try {
                // body = JSON.parse(body);
                deferred.resolve(body);
            } catch (e) {
                deferred.reject({error: e});
            }

        });
    });
    return deferred.promise;
}

function wikiText(wikiId) {
    var deferred = q.defer();
    https.get({
        hostname: 'api.osf.io',
        path: '/v2/wikis/' + wikiId + "/content/",
        headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer' + apiToken
        }
    }, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            try {
                //body = JSON.parse(body);
                deferred.resolve(body);
            } catch (e) {
                deferred.reject({error: e});
            }

        });
    });
    return deferred.promise;
}

