const { connect } = require("mongoose");

const connectDatabase = () => {
  return connect("mongodb://127.0.0.1:27017/api-demo");
};

exports.connectDatabase = connectDatabase;
