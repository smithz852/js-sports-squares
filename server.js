const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { availableParallelism } = require("node:os");
const cluster = require("node:cluster");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const exphbs = require("express-handlebars");
const Sequelize = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const session = require("express-session");
const cors = require("cors");
const routes = require("./controllers");
const hbs = exphbs.create({ helpers: require("./utils/helpers") });

const PORT = process.env.PORT || 3001;

// Configure Sequelize for PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  return setupPrimary();
}

async function main() {
  const app = express();

  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter(),
  });

  // Define Messages model for PostgreSQL
  const Messages = sequelize.define("Messages", {
    client_offset: {
      type: Sequelize.TEXT,
      unique: true,
    },
    content: {
      type: Sequelize.TEXT,
    },
  });

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'views'));
    res.render("login");
  });

  io.on("connection", async (socket) => {
    console.log("a user connected");
    socket.on("chat message", async (msg, clientOffset, callback) => {
      try {
        const message = await Messages.create({
          content: msg,
          client_offset: clientOffset,
        });
        io.emit("chat message", msg, message.id);
        callback();
      } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
          callback();
        }
      }
    });

    if (!socket.recovered) {
      try {
        const messages = await Messages.findAll({
          where: { id: { [Sequelize.Op.gt]: socket.handshake.auth.serverOffset || 0 } },
        });
        messages.forEach((row) => {
          socket.emit("chat message", row.content, row.id);
        });
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    }
  });

  const sess = {
    secret: process.env.DB_PASSWORD,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({ db: sequelize }),
  };

  app.use(cors());
  app.use(session(sess));

  app.engine("handlebars", hbs.engine);
  app.set("view engine", "handlebars");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(join(__dirname, "public")));
  app.use(routes);

  await sequelize.sync({ force: false });
  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}
main();
