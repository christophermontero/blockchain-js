const express = require("express");
const app = express();
require("colors");

require("./src/config")(app);
require("./src/routes")(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold
  );
});
