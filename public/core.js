angular.module('todoApp', [])
  .controller('TodoListController', function($http, $scope) {
    var todoList = this;
	  $http.get('/api/todos')
		.then(function(data) {
		  todoList.todos = data.data;
		  console.log(todoList);
		}, function (error) {
		  console.log('Error: ' + data);
		});
 
    todoList.addTodo = function() {
	  $http.post('/api/todos', {text:todoList.todoText, done:false})
      todoList.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };

	$scope.toggleSelection = function toggleSelection(event, index) {
	  todo_id = todoList.todos[index]._id;
	  $http.post('/api/todos/' + todo_id, {done: event.target.checked})
	};

    todoList.archive = function() {
      var oldTodos = todoList.todos;
      todoList.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
      });
    };
  });
