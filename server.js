var express  = require('express');
var mongoose = require('mongoose');
var app = express();
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// Database configuration =================
var mongoDB = 'mongodb://xavier:12345@ds115350.mlab.com:15350/todolist'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// App conf ===============================
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.listen(8080);
console.log("App listening on port 8080");

// define model =================
var Todo = mongoose.model('Todo', {
	text : String,
    done: Boolean
});

// routes ======================================================================

app.get('/api/todos', function(req, res) {
  Todo.find(function(err, todos) {
	// If there is no task, we get fakes one from API
	if (todos === undefined || todos.length ==0) {
	  var request = require('request');
	  request('https://jsonplaceholder.typicode.com/todos', function (error, response, body) {
		// We only need 10 tasks
		todos = JSON.parse(body).slice(0, 10);

		for (var i = 0; i < todos.length; i++) {
		  Todo.create({
			text : todos[i].title,
			done : todos[i].completed
		  });
		  todos[i].text = todos[i].title;
		  todos[i].text = todos[i].title;
		  delete todos[i].completed;
		  delete todos[i].title;
		  delete todos[i].userId;
		  delete todos[i].id;
		}
		todos['data'] = todos;
	  });
	}
	res.json(todos);
  });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
  // create a todo, information comes from AJAX request from Angular
  Todo.create({
	text : req.body.text,
	done : req.body.done
  }, function(err, todo) {
    if (err) return res.status(500).send({ error: err });
	return res.status(200).send(todo)
  });
});

app.post('/api/todos/:todo_id', function(req, res) {
  var query = {'_id':req.params.todo_id};
  newState = { done: req.body.done};
  Todo.findOneAndUpdate(query, newState, {upsert:true}, function(err, doc){
    if (err) return res.status(500).send({ error: err });
	return res.status(200).send("done")
  });
});

app.delete('/api/todos/:todo_id', function(req, res) {
  Todo.remove({
	_id : req.params.todo_id
  }, function(err, doc) {
    if (err) return res.status(500).send({ error: err });
	return res.status(200).send("done")
  });
});

 // Angular application -------------------------------------------------------------
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
