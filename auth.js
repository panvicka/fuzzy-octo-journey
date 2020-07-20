module.exports = function (app, sql) {

    const crypto = require("crypto");


    app.post("/user/register", function (request, response) {

        request.body.salt = crypto.randomBytes(16).toString("hex");
        var passwordHash = crypto
            .pbkdf2Sync(request.body.password, request.body.salt, 1000, 64, "sha512")
            .toString("hex");

        request.body.password = passwordHash;
        sql.addUser(request.body, function (result) {
            response.send(result);
        });

    });
};

