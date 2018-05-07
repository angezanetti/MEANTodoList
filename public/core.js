angular.module('todoApp', [])
  .controller('TodoListController', function($http, $scope, $window) {
    var todoList = this;
	  $http.get('/api/todos')
		.then(function(data) {
		  todoList.todos = data.data;
		}, function (error) {
		  console.log('Error: ' + error);
		});
 
    todoList.addTodo = function() {
	  var task = $window.prompt('Enter your new task');
	  $http.post('/api/todos', {text:task, done:false})
		.then(function(data) {
			todoList.todos.push({_id: data.data._id, text: data.data.text, done:false});
		}, function (error) {
		  console.log('Error: ' + JSON.stringify(error));
		});
    };

	// Change the state of a todo 
	$scope.toggleSelection = function toggleSelection(event, index) {
	  todo_id = todoList.todos[index]._id;
	  $http.post('/api/todos/' + todo_id, { done: event.target.checked})
	};

    $scope.delete = function(index) {
	  todo_id = todoList.todos[index]._id;
	  $http.delete('/api/todos/' + todo_id);
      todoList.todos.splice(index, 1);
    };

	// Trash visible only on hover
	$scope.hoverIn = function(){
	  this.hoverEdit = true;
	};

	$scope.hoverOut = function(){
	  this.hoverEdit = false;
	};
  });
