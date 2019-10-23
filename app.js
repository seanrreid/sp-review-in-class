const express = require("express"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    logger = require("morgan"),
    es6Renderer = require("express-es6-template-engine"),
    session = require("express-session"),
    FileStore = require("session-file-store")(session);

const indexRouter = require("./routes/index"),
    usersRouter = require("./routes/users");

require("dotenv").config();

const app = express();

app.engine("html", es6Renderer);
app.set("views", "./views");
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        store: new FileStore(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        is_logged_in: false
    })
);

// Middleware to prevent searching for the favicon
app.use(function(req, res, next) {
    if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
        return res.sendStatus(204);
    }
    return next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
