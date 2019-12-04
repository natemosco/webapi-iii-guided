const express = require("express"); // importing a CommonJS module
const helmet = require("helmet"); //<<<<<<<<<< install the package 1:

const hubsRouter = require("./hubs/hubs-router.js"); //local files

const server = express();

//middleware

server.use(helmet()); // <<<<<<<<<<<<< use it 2:   GLOBAL
server.use(express.json()); // built-in middleware
server.use(logger);

// endpoints
server.use("/api/hubs", checkRole("admin"), hubsRouter); // the router is local middleware, because it only applies to /api/hubs

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// commit
server.get("/echo", (req, res) => {
  res.send(req.headers);
});

// shift + alt + up (or down) to copy the selected lines
server.get("/area51", gateKeeper, checkRole("agent"), (req, res) => {
  res.send(req.headers);
});

module.exports = server;

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);

  // res.send("all good");   // this acts like a return and prevents any next middleware from functioning

  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon', let it continue
//if not, send back status code 401 and a message

function gatekeeper(req, res, next) {
  if (req.headers.password === "mellon") {
    next(); // allows the request to continue to the next middleware or route handler
  } else {
    res.status(401).json({
      errorMessage:
        "Incorrect credentials, session may have timed-out. Please log back into account to continue to this page"
    });
  }
}

// checkRole('admin'), checkRole('agents')
function checkRole(role) {
  return function(req, res, next) {
    if (role && role === req.headers.role) {
      next();
    } else {
      res.status(403).json({ message: "can't touch this!" });
    }
  };
}
