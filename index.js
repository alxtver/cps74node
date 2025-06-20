const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const favicon = require("express-favicon");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const partMiddleware = require("./middleware/part");
const bodyParser = require("body-parser");
const config = require("./config.js");
const cors = require("cors");
const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const homeRoutes = require("./routes/home");
const apkziRoutes = require("./routes/apkzi");
const addRoutes = require("./routes/add");
const pkiRoutes = require("./routes/pkis");
const assemblyRoutes = require("./routes/assembly");
const pcPaRoutes = require("./routes/pcPa");
const authRoutes = require("./routes/auth");
const spRoutes = require("./routes/sp");
const logsRoutes = require("./routes/logs");
const searchRoutes = require("./routes/search");
const equipmentRoutes = require("./routes/equipment");
const projectsRoutes = require("./routes/projects");
const countriesRoutes = require("./routes/countries");
const specRoutes = require("./routes/spec");
const systemCasesRoutes = require("./routes/systemCase");

io.on("connect", (socket) => {
  socket.on("updateAssemblyPC", function (data) {
    io.emit("updateAssemblyPC", data);
  });
});

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

mongoose.set("useCreateIndex", true);
const store = new MongoStore({
  collection: "sessions",
  uri: config.url,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(
  session({
    secret: config.secretkey,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use(partMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/pkis", pkiRoutes);
app.use("/apkzi", apkziRoutes);
app.use("/assembly", assemblyRoutes);
app.use("/spec", specRoutes);
app.use("/pcPa", pcPaRoutes);
app.use("/projects", projectsRoutes);
app.use("/auth", authRoutes);
app.use("/sp", spRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/logs", logsRoutes);
app.use("/countries", countriesRoutes);
app.use("/search", searchRoutes);
app.use("/systemCases", systemCasesRoutes);
app.use(function (req, res) {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(config.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
