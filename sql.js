const Sequelize = require("sequelize");
const crypto = require("crypto");

const articles = require("./articles");
const { request } = require("express");
 

const sequelize = new Sequelize("ngblog", "root", "1234",
    {
        host: "localhost",
        dialect: "mariadb",
        port: 3308,
        dialectOptions: {
            timezone: process.env.db_timezone
        }
    });


const User = sequelize.define("user", {
    name: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    salt: { type: Sequelize.STRING, allowNull: false },
});

const Article = sequelize.define('article', {
    // id is given automatically 
    title: { type: Sequelize.STRING },
    key: { type: Sequelize.STRING },
    date: { type: Sequelize.DATE },
    content: { type: Sequelize.TEXT },
    description: { type: Sequelize.TEXT },
    imageUrl: { type: Sequelize.STRING },
    viewCount: { type: Sequelize.INTEGER },
    published: { type: Sequelize.BOOLEAN },
});



init = function () {
    sequelize
        .authenticate()
        .then(() => {
            console.log("connected to database");
        }).catch(err => {
            console.log("cant connect: ", err);
        });

    Article.sync({ force: true }).then(() => {
        Article.create({
            title: 'Firrtt',
            content: 'Lorem ipsum  dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt \
            ut labore et dolore magna aliqua. In nibh mauris cursus mattis molestie a. Et ultrices neque ornare \
            aenean euismod elementum nisi. Purus faucibus ornare suspendisse sed nisi lacus. Tincidunt arcu non \
            sodales neque sodales ut etiam sit. Ac turpis egestas sed tempus urna et pharetra pharetra. Mattis\
            volutpat maecenas volutpat blandit aliquam etiam erat velit.Mauris vitae ultricies leo integer malesuada nunc vel. \
            Nec dui nunc mattis enim ut tellus elementum sagittis.Sed euismod nisi porta lorem mollis</p> \
            aliquam ut porttitor leo.Scelerisque purus semper eget duis at tellus at urna.Luctus accumsan \
            <p>tortor posuere ac  ut consequat semper viverra nam.Morbi tristique senectus et netus et malesuada fames ac turpis.Diam \
            vulputate ut pharetra sit amet aliquam id diam.Orci porta non pulvinar neque.Amet porttitor eget dolor morbi non.Consectetur\
            adipiscing elit ut aliquam purus sit amet.Pulvinar sapien et ligula ullamcorper malesuada proin.</p>',
            description: 'bla bla bla blab la',
            date: new Date(),
            key: 'first',
            imageUrl: 'https://loremflickr.com/320/240/hair',
            published: true,
        });
        Article.create({
            title: 'Second',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt \
            ut labore et dolore magna aliqua. In nibh mauris cursus mattis molestie a. Et ultrices neque ornare \
            aenean euismod elementum nisi. Purus faucibus ornare suspendisse sed nisi lacus. Tincidunt arcu non \
            sodales neque sodales ut etiam sit. Ac turpis egestas sed tempus urna et pharetra pharetra. Mattis\
            aliquam ut porttitor leo.Scelerisque purus semper eget duis at tellus at urna.Luctus accumsan \
            <p>tortor posuere ac ut consequat semper viverra nam.Morbi tristique senectus et netus et malesuada fames ac turpis.Diam \
            vulputate ut pharetra sit amet aliquam id diam.Orci porta non pulvinar neque.Amet porttitor eget dolor morbi non.Consectetur\
            adipiscing elit ut aliquam purus sit amet.Pulvinar sapien et ligula ullamcorper malesuada proin.</p>',
            description: 'bla bla bla',
            date: new Date(),
            key: 'second',
            imageUrl: 'https://loremflickr.com/320/240/snail',
            published: false,
        });
    });

    User.sync();
}


getArticles = function (callback) {
    Article.findAll({
        order: sequelize.literal("date DESC"),
        where: { published: true }
    }).then(articles => callback(articles));
};

getArticleByKey = function (options, callback) {
    Article.findOne({ where: { key: options.key, published: true } }).then(article => {
        if (article != null) {
            article.update({
                viewCount: ++article.viewCount
            })
        }
        callback(article)
    });
};


getDashboardArticles = function (callback) {
    Article.findAll({ order: sequelize.literal("date DESC") }).then(articles => callback(articles));
};



updateArtcilePublishState = function (request, callback) {
    Article.findOne({ where: { id: request.id } }).then(function (article) {
        if (article != null) {
            article.update({
                published: request.published
            });
        }
        callback(article);
    })
}


getDashboardArticleByKey = function (key, callback) {
    Article.findOne({ where: { key: key } }).then(article => callback(article));
}


updateArticle = function (request, callback) {
    Article.findOne({ where: { id: request.id } }).then(function (article) {
        article.update({
            title: request.title,
            key: request.key,
            date: request.date,
            imageUrl: request.imageUrl,
            description: request.description,
            content: request.content
        });
        callback(article);
    });
};

deleteArticle = function (id, callback) {

    Article.findOne({ where: { id: id } }).then(function (article) {
        if (article != null) {
            article.destroy().then(result => callback(result));
        } else {
            callback(null);
        }
    });
};


createArticle = function (request, callback) {
    Article.create({
        title: request.title,
        key: request.key,
        date: request.date,
        imageUrl: request.imageUrl,
        description: request.description,
        content: request.content,
    }).then(article => callback(article));
};


addUser = function (user, callback) {
    User.create({
        name: user.name.toLowerCase(),
        password: user.password,
        salt: user.salt,
    }).then(callback(true));
};

login = function(request, callback) {
    
    User.findOne({
        where: {
            name: request.name
        }
    }).then(function (user) {
      
        if (user !== null) {
            var passwordHash = crypto.
                pbkdf2Sync(request.password, user.salt, 1000, 64, "sha512").
                toString("hex");
       
                if (passwordHash === user.password) {
                    callback(true);
                    return;
                }
        }
        callback(false);
    });

};




module.exports.init = init;
module.exports.getArticles = getArticles;
module.exports.getArticleByKey = getArticleByKey;
module.exports.getDashboardArticles = getDashboardArticles;
module.exports.updateArtcilePublishState = updateArtcilePublishState;
module.exports.getDashboardArticleByKey = getDashboardArticleByKey;
module.exports.updateArticle = updateArticle;
module.exports.deleteArticle = deleteArticle;
module.exports.createArticle = createArticle;
module.exports.addUser = addUser;
module.exports.login = login;
