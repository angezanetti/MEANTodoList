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
	text : String
});

// routes ======================================================================

app.get('/api/todos', function(req, res) {
  Todo.find(function(err, todos) {
	res.json(todos); // return all todos in JSON format
  });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
  // create a todo, information comes from AJAX request from Angular
  Todo.create({
	text : req.body.text,
	done : false
  }, function(err, todo) {
	if (err) res.send(err);
	// get and return all the todos after you create another
	Todo.find(function(err, todos) {
	  if (err)
		res.send(err)
	  res.json(todos);
	});
  });

});

app.delete('/api/todos/:todo_id', function(req, res) {
  Todo.remove({
	_id : req.params.todo_id
  }, function(err, todo) {
	if (err)
	  res.send(err);
	// get and return all the todos after you create another
	Todo.find(function(err, todos) {
	  if (err)
		res.send(err)
	  res.json(todos);
	});
  });
});
