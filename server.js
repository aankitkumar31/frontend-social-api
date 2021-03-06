var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
var jwt = require("express-jwt");
require('dotenv').config()

mongoose.Promise = global.Promise;

var app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

/*  heartbeat
 */
app.get("/", function(req, res) {
  res.status(200).json({ message: "Welcome to Frontend Social API! v1" });
});

require("./routes/auth.routes.js")(app);
require("./routes/job.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/city.routes.js")(app);
require("./routes/conference.routes.js")(app);

// this will attach the logged in user to req.user
const JWT_SECRET = process.env.JWT_SECRET || "verySecret$%#$%@#!#!$!!";
app.use(jwt({ secret: JWT_SECRET }));

require("./routes/profile.routes.js")(app);

var server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("Server is listening on port " + port);
});
