const express = require("express");
const app = express();
// require('express-ws')(app);


const path = require("path");
const ejslay = require("express-ejs-layouts");
const flash = require('connect-flash')
const session = require('express-session')
const cookieparser = require('cookie-parser')
const passport = require('passport')
require('./controlers/passport')(passport)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())
app.use(ejslay);
app.use(flash())
app.use(
  session({
    secret: "112211",
    resave: true,
    saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
      httpOnly: true,
      maxAge: 2147483647
    }
  })
)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(require('./controlers/flashmsg.js'))
app.use(require('./rotues/index'))
//io.on('connection', require('./socket/connection.js'));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    serveClient: true,
    origins: '*:*',
    transports: ['polling'],  
    pingInterval: 60000,
    pingTimeout: 25000,
    cookie: true,
    cors: {
        origin: "https://1inf.vanikthai.com",
        methods: ["GET", "POST"],
        allowedHeaders: ["vanikthaiapp"],
        credentials: true
      }
  });

io.on('connection', require('./socket/connection.js'));
server.listen();