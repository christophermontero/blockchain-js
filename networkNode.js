const express = require("express");
const app = express();
require("colors");

require("./src/startup/config")(app);
require("./src/startup/endpoints")(app);

const port = process.argv[2];

app.listen(port, () => {
  console.log(
    `Node is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold
  );
});
