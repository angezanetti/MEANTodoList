angular.module('todoApp', [])
  .controller('TodoListController', function($http, $scope, $window) {
    var todoList = this;
	  $http.get('/api/todos')
		.then(function(data) {
		  todoList.todos = data.data;
		}, function (error) {
		  console.log('Error: ' + data);
		});
 
    todoList.addTodo = function() {
	  var task = $window.prompt('Enter your new task');
	  $http.post('/api/todos', {text:task, done:false})
      todoList.todos.push({text:task, done:false});
      todoList.todoText = '';
    };

	// Change the state of a todo 
	$scope.toggleSelection = function toggleSelection(event, index) {
	  todo_id = todoList.todos[index]._id;
	  $http.post('/api/todos/' + todo_id, { done: event.target.checked})
	};

    $scope.delete = function(index) {
	  todo_id = todoList.todos[index]._id;
	  $http.delete('/api/todos/' + todo_id);
      todoList.todos = todoList.todos.slice(index);
    };
  });
