const Sequelize = require("sequelize");

const sequelize = new Sequelize("ngblog", "root", "1234",
    {
        host: "localhost",
        dialect: "mariadb",
        port: 3308,
        dialectOptions: {
            timezone: process.env.db_timezone
        }
    });


init = function () {
    sequelize
        .authenticate()
        .then(() => {
            console.log("connected to database");
        }).catch(err => {
            console.log("cant connect: ", err);
        });
}


module.exports.init = init;