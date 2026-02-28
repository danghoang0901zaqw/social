const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes");
const connectDB = require("../config/connect");
const { errorHandler } = require("./middlewares/errorHandler.middlewares");


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(bodyParser.json());

routes(app);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
