const express = require("express");
const app = express();
const morgan = require("morgan");

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

require("colors");

// Routes
const blockchain = require("./src/routes/blockchain");
const transaction = require("./src/routes/transaction");
const mine = require("./src/routes/mine");

// Mount routes
app.use("/api/v1/blockchain", blockchain);
app.use("/api/v1/transaction", transaction);
app.use("/api/v1/mine", mine);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});
