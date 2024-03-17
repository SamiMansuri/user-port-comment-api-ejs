const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/api-demo",
  collection: "mySessions",
});

store.on("error", (error) => console.log(error));

module.exports = store;
