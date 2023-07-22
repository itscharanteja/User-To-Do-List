const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
mongoose
  .connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected successfully");
  });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// let newTask = [];
// let workTask = [];

const listSchema = new mongoose.Schema({
  name: String,
});
const customListSchema = new mongoose.Schema({
  name: String,
  items: [listSchema],
});

const List = new mongoose.model("List", listSchema);
const customList = new mongoose.model("customList", customListSchema);

const task1 = new List({
  name: "Play BGMI",
});
const task2 = new List({
  name: "Home Work",
});
const task3 = new List({
  name: "Reminder!",
});

var day = date.getDay();
var today = date.getDate();
var currentDay = day;
const defaultList = [task1, task2, task3];

app.get("/", (req, res) => {
  List.find({}).then((foundDocs, err) => {
    if (foundDocs.length === 0) {
      List.insertMany(defaultList).then((docs, err) => {
        if (err) {
          console.log("There was an error");
        } else {
          console.log("Successfully inserted to empty database");
          res.redirect("/");
        }
      });
    } else {
      // console.log(foundDocs);
      if (currentDay == 6 || currentDay == 0) {
        day = "weekend";
      } else {
        day = "workday";
      }
      let data = {
        KindOfDay: today,
        typeOfList: day,
        list: foundDocs,
      };
      res.render("list", data);
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  const list = new customList({
    name: customListName,
    items: defaultList,
  });

  customList.findOne({ name: customListName }).then((foundList, err) => {
    if (!err) {
      if (!foundList) {
        console.log("Does'nt Exists!");
        list.save();
        res.redirect("/" + customListName);
      } else {
        // console.log("Exists");
        res.render("list", {
          KindOfDay: "",
          typeOfList: customListName,
          list: foundList.items,
        });
      }
    }
  });
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
  const itemName = req.body.newItem;
  const listName = req.body.list;
  // console.log(listName);

  const newItem = new List({
    name: itemName,
  });

  if (listName === "weekend" || listName === "weekday") {
    newItem.save().then((item) => {
      console.log(item);
    });

    // defaultList.push(itemName);
    res.redirect("/");
  } else {
    customList.findOne({ name: listName }).then((foundList, err) => {
      console.log(foundList);
      foundList.items.push(newItem);
      foundList.save();

      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const delCheck = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "weekend") {
    List.findOneAndDelete(delCheck).then((item) => {
      console.log(item + "deleted successfully");
    });
    res.redirect("/");
  } else {
    customList
      .findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: delCheck } } }
      )
      .then((foundList, err) => {
        if (!err) {
          res.redirect("/" + listName);
        } else {
          console.log(foundList);
        }
      });
  }
});

app.listen(3000, () => {
  console.log("Port is listening");
});
