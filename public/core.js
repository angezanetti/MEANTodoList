angular.module('todoApp', [])
  .controller('TodoListController', function($http) {
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
 
    todoList.remaining = function() {
      var count = 0;
      angular.forEach(todoList.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
 
    todoList.archive = function() {
      var oldTodos = todoList.todos;
      todoList.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
      });
    };
  });
