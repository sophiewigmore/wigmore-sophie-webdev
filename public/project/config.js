//The main purpose of this file is to configure the file
(function () {
    angular
        .module("WebDevProject")
        .config(configuration)
        .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);

    }]);

    function configuration($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
        $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';

        $routeProvider
            .when("/", {
                templateUrl: "views/search/templates/search.html",
                controller: "searchController",
                controllerAs: "model",
                resolve : {
                    user: loggedInForSearch
                }
            })
            .when("/details/:nodeId", {
                templateUrl: "views/details/templates/details.html",
                controller: "detailsController",
                controllerAs: "model",
                resolve : {
                    user: loggedInForDetails
                }
            })
            .when("/login", {
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: "model"
            })
            .when("/profile", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: "model",
                resolve : {
                    user: checkLogin
                }
            })
            .when("/register", {
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "registerController",
                controllerAs: "model"
            })
    }

    function checkLogin(projectUserService, $q, $location) {
        var deferred = $q.defer();
        projectUserService
            .checkLogin()
            .then(function (user) {
                if(user === '0') {
                    deferred.reject();
                    $location.url("/login");
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function loggedInForDetails(projectUserService, $q, $location) {
        var deferred = $q.defer();
        projectUserService
            .checkLogin()
            .then(function (user) {
                if (user === "0") {
                    deferred.resolve(null);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function loggedInForSearch(projectUserService, $q, $location) {
        var deferred = $q.defer();
        projectUserService
            .checkLogin()
            .then(function (user) {
                if (user === "0") {
                    deferred.resolve(null);
                    $location.url("/");
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
})();