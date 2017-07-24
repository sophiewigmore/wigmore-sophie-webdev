(function () {
    angular
        .module("WamApp")
        .controller("pageEditController", pageEditController);

    function pageEditController($routeParams, pageService, $location) {
        var model = this;
        model.userId = $routeParams.userId;
        model.webId = $routeParams.webId;

        function init() {
            model.pages = pageService.findPagesByWebsiteId(model.webId);
        }
        init();

    }



})();