const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: ["http://localhost:4200", "http://localhost:4201"]
}

app.use(cors(corsOptions));

app.listen(8000, () => {

    console.log("server is started and listening");

});


app.get("/", function (request, response) {
    response.send("Hello lode.js");
});


require("./articles.js")(app);