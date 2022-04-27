const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})