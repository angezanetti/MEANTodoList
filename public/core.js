angular.module('todoApp', [])
  .controller('TodoListController', function($http, $scope) {
    var todoList = this;
	  $http.get('/api/todos')
		.then(function(data) {
		  todoList.todos = data.data;
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
	  $http.post('/api/todos/' + todo_id, { done: event.target.checked})
	};

    $scope.delete = function(index) {
	  console.log('delete' + index);
	  todo_id = todoList.todos[index]._id;
	  $http.delete('/api/todos/' + todo_id);
      todoList.todos = todoList.todos.slice(index);
	  console.log(todoList.todos);
    };
  });
