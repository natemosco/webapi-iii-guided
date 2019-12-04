const express = require("express"); // importing a CommonJS module
const helmet = require("helmet"); //<<<<<<<<<< install the package 1:

const hubsRouter = require("./hubs/hubs-router.js"); //local files

const server = express();

//middleware

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  // res.send("all good");
  next(); // allows the request to continue to the next middleware or route handler
}

function gatekeeper(req, res, next) {
  if (req.headers.password === "mellon") {
    next(); // allows the request to continue to the next middleware or route handler
  } else {
    res
      .status(401)
      .json({
        errorMessage:
          "Incorrect credentials, session may have timed-out. Please log back into account to continue to this page"
      });
  }
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon', let it continue
//if not, send back status code 401 and a message

server.use(helmet()); // <<<<<<<<<<<<< use it 2:   GLOBAL
server.use(express.json()); // built-in middleware
server.use(logger());

// server.use('/api/hubs', helmet(), hubsRouter); //can use it for all routes
server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

server.get("/area51", [helmet(), gatekeeper()], (req, res) => {
  res.send(req.headers);
});
module.exports = server;
