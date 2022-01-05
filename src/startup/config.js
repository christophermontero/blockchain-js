const express = require("express");
const morgan = require("morgan");

module.exports = function (app) {
  // Body parser
  app.use(express.json());

  // Logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
};
