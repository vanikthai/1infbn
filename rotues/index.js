const expess = require("express");
const route = expess.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated,
  ensureAdmin
} = require('../controlers/auth.js')
route.get("/",ensureAuthenticated, (req, res) => {
  res.render("index.ejs",{ user: req.user });
});
route.get("/profile",ensureAuthenticated, (req, res) => {
  res.render("profile.ejs",{ user: req.user });
});
route.get("/login",forwardAuthenticated, (req, res) => {
  res.render("login.ejs", { user: "" });
});
route.get("/chat",ensureAuthenticated, (req, res) => {
  res.render("chat.ejs", { user: req.user });
});
route.get("/register",forwardAuthenticated, (req, res) => {
  res.render("register.ejs", { user: "" });
});
route.get("/setting",ensureAdmin, (req, res) => {
  res.render("setting.ejs",{ user: req.user });
});

route.get("/data/:key", require("./data.js"));
route.get('/logout', require("./logout.js"))
route.post("/datakey", require("./datakey.js"));
route.post("/login", require("./login.js"));
route.post("/register", require("./register.js"));
route.post("/setting/drop", require("./tabledrop.js"));
route.post("/setting/create", require("./tablecreate.js"));

// route.ws('/chat', require('./ws/wschat.js'))


module.exports = route;
