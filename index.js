const { createServer } = require("http");
const { app } = require("./src/app.js");
const { connectDatabase } = require("./src/utils/dbConnection.util.js");
require("dotenv").config();

const port = process.env.PORT;

connectDatabase()
  .then(() => {
    createServer(app).listen(port, () => {
      console.log("Server connected at port ", port);
    });
  })
  .catch(() => {
    console.log("Server is not running.");
  });
