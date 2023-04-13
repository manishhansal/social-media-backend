const http = require("http");
const app = require("./routes/user");
const connectToDB = require("./db_connection/mongodb");
const port = process.env.PORT || 9110;
const server = http.createServer(app);

server.listen(port, () => {
  new connectToDB();
  console.log(`Server is running on port ${port}`);
});