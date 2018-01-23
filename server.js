var express = require("express"),
  path = require("path"),
  cors = require('cors'),
  bodyParser = require("body-parser"),
  mongodb = require("mongodb"),
  moment = require('moment-timezone');
var ObjectID = mongodb.ObjectID;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(cors());

var db;

// Connection to the database
mongodb.MongoClient.connect('mongodb://localhost:27017/tasks', function (err, database) {
  if (err) {
    console.log(err);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

//get all Tasks

app.get("/task", function (req, res) {
  db.collection('tasks').find({}).toArray(function (err, task) {
    if (err) {
      handleError(res, err.message, "Failed to get tasks.");
    } else {
      task = JSON.parse(JSON.stringify(task));
      for (var i = 0; i < task.length; i++) {
        if (moment(task[i].dueDate) > moment()) {
          task[i].dueDateCont = 1;
        } else {
          task[i].dueDateCont = 0;
        }
        task[i].dueDate = moment(task[i].dueDate).tz("Asia/Kolkata").format("YYYY-MM-DD");
      }
      console.log(task)
      res.json(task);
    }
  });
});

// creates a new Task

app.post("/task/create", function (req, res) {
  var newTask = req.body;
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();
  db.collection('tasks').insertOne(newTask, function (err, task) {
    if (err) {
      handleError(res, err.message, "Failed to create new Task.");
    } else {
      task = JSON.parse(JSON.stringify(task));
      task.dueDate = moment(task.dueDate).tz("Asia/Kolkata").format("YYYY-MM-DD");
      res.json(task);
    }
  });
});

// find task by id

app.get("/tasks/:id", function (req, res) {
  db.collection('tasks').findOne({ _id: new ObjectID(req.params.id) }, function (err, task) {
    if (err) {
      handleError(res, err.message, "Failed to get task");
    } else {
      res.status(200).json(task);
    }
  });
});

//  update task by id

app.post("/task/destroy/:id", function (req, res) {
  var id = req.body._id;
  db.collection('tasks').update(
    { _id: mongodb.ObjectId(id) },
    { $set: { name: req.body.name, dueDate: moment(req.body.dueDate).tz("Asia/Kolkata").format("YYYY-MM-DD"), priority: req.body.priority, updatedAt: moment().tz("Asia/Kolkata") } },
    function (err, doc) {
      res.json(doc);
    });
});

//delete task
app.post("/task/destroy", function (req, res) {
  var id = req.body._id;
  db.collection('tasks').remove({ _id: mongodb.ObjectId(id) },
    function (err, removedTask) {
      res.json(removedTask);
    });

});