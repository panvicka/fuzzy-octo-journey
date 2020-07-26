const { SlowBuffer } = require("buffer");

const isAuthenticated = require("./isAuthenticated.js");

module.exports = function (app, sql) {


    app.get("/dashboard/overview", isAuthenticated, function (request, response) {

        sql.getDashboardArticles(result => response.send(result));

    });


    app.post("/dashboard/article/publish", isAuthenticated,function (request, response) {

        const id = request.body.id; // body is article send to service
        //we need body parser 
        const published = request.body.published;
        sql.updateArtcilePublishState({ id: id, published: published }, function (article) {
            response.send(article);
        });
    });

    app.get("/dashboard/article/:key",  isAuthenticated, function (request, response) {

        sql.getDashboardArticleByKey(request.params.key, result =>
            response.send(result)
        );


    });


    app.put("/dashboard/article", isAuthenticated,function (request, response) {
        sql.updateArticle(request.body, function (result) {
            response.send(result);
        })
    });

    app.delete("/dashboard/article/:id", isAuthenticated,function (request, response) {

        sql.deleteArticle(request.params.id, result => {
            if (result != null) {
                response.send(result);
            } else {
                response.send(400).send({ message: "Article could not be deleted" });
            }
        })
    });

    app.post("/dashboard/article", isAuthenticated,function (request, response) {

        sql.createArticle(request.body, function (result) {
            response.send(result);
        })
    });


}