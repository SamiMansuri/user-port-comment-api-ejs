const express = require("express");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const { IndexRouter } = require("./routes/index.route");
const store = require("./utils/mongoDb.utils");
const {
  errorHandler,
  notFoundHandler,
  validationError,
} = require("./middlewares/error.middleware");
const passport = require("passport");

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(methodOverride("_method"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(flash());

app.use(IndexRouter);

app.use(validationError);
app.use(notFoundHandler);
app.use(errorHandler);

exports.app = app;
