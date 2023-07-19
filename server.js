const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let newTask = [];
let workTask = [];

app.get("/", (req, res) => {
  let day = date.getDay();
  let today = date.getDate();
  let currentDay = day;
  console.log(currentDay);

  if (currentDay == 6 || currentDay == 0) {
    day = "weekend";
  } else {
    day = "workday";
  }
  let data = {
    KindOfDay: today,
    typeOfList: day,
    list: newTask,
  };
  res.render("list", data);
});

app.get("/work", (req, res) => {
  res.render("list", { typeOfList: "Work day", KindOfDay: "", list: workTask });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/work", (req, res) => {
  let work = req.body.list;
  workTask.push(work);
  res.redirect("/work");
});
app.post("/", (req, res) => {
  let task = req.body.newItem;
  if (req.body.list === "Work") {
    workTask.push(task);
    res.redirect("/work");
  } else {
    newTask.push(task);
    res.redirect("/");
  }

  
});

app.listen(3000, () => {
  console.log("Port is listening");
});

console.log(date.name);
