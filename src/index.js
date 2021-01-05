const express = require("express");
const morgan = require("morgan"); //muestra por consola las petciiones que van llegando
const path = require("path"); //para indicar los directorios
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const MySQLStore = require("express-mysql-session")(session); //Este modulo me permite guardar la sesión en la base de datos
const { database } = require("./db_credenciales");

//inicializaciones
const app = express();
require("./lib/passport");

//settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);

app.set("view engine", ".hbs");

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "SesionMySQL",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req, res, next) => {
  app.locals.success = req.flash("success"); //Lo declaro acpa para poder usarlo desde mis vistas
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

//Rutas
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/lugares", require("./routes/lugares"));

//Rutas Administrador
app.use("/users", require("./routes/users"));
app.use("/rubros", require("./routes/rubros"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//Starting the server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
