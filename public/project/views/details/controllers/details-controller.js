(function () {
    angular
        .module("WebDevProject")
        .controller("detailsController", detailsController);

    function detailsController(articleService, $routeParams, user, projectUserService, commentService, $location) {
        var model = this;
        model.nodeId = $routeParams['nodeId'];
        model.currentUser = user;
        model.comment = null;
        model.saveArticle = saveArticle;
        model.unsaveArticle = unsaveArticle;
        model.createComment = createComment;
        model.deleteComment = deleteComment;

        function init() {
            articleService
                .getNodeDetails(model.nodeId)
                .then(function (node) {
                    console.log(parseNode(node));
                    model.node = parseNode(node);
                });

            articleService
                .getWikiDetails(model.nodeId)
                .then(function (wiki) {
                    model.wiki = JSON.parse(wiki).data[0].id;
                    articleService
                        .getWikiText(model.wiki)
                        .then(function (wikiText) {
                            model.wikiText = wikiText;
                        })

                });
            articleService
                .getContributor(model.nodeId)
                .then(function (node) {
                    model.contributor = JSON.parse(node).data[0].embeds.users.data.attributes.full_name;
                });
            commentService
                .getCommentsForNode(model.nodeId)
                .then(function (comments) {
                    model.comments = comments;
                })
        }

        init();
        function parseNode(node) {
            var parsedData = JSON.parse(node);
            return parsedData.data;
        }

        function saveArticle(node) {
            var nodeId = node.id;
            if(!model.currentUser) {
                model.errorMessage = "Sign in or register to save this post!";
            } else {
                model.currentUser.articles.push(nodeId);
                projectUserService
                    .updateUser(model.currentUser._id, model.currentUser)
                    .then(function (response) {
                        model.user = response.data;
                    })
                    .then(function () {
                        model.errorMessage2 = "Article Saved!";
                    })
            }
        }

        function unsaveArticle(node) {
            var nodeId = node.id;
            var articleIndex = model.currentUser.articles.indexOf(nodeId);
            model.currentUser.articles.splice(articleIndex, 1)[0];
            projectUserService
                .updateUser(model.currentUser._id, model.currentUser)
                .then(function (response) {
                    model.user = response.data;
                });
        }

        function createComment(nodeId, user, comment) {
            comment._nodeId = nodeId;
            comment._user = user;
            commentService
                .createComment(comment)
                .then(function (createdComment) {
                    commentService
                        .getCommentsForNode(nodeId)
                        .then(function (comments) {
                            model.comments = comments;
                        })
                })
        }

        function deleteComment(comment) {
            commentService
                .deleteComment(comment._id)
                .then(function () {
                    location.reload();
                })
        }



    }

})();