jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		id: function () {
			return parseInt(Math.random() * 1000000);
		},
		pluralize: function (count, word) {
			if(count === 1){
				return word;
			} else {
				return word + 's';
			}
		},
		store: function (data) {
			return localStorage.setItem('todos-jquery', JSON.stringify(data));
		},
		getStore: function(){
			if(localStorage.getItem('todos-jquery')){
				return JSON.parse(localStorage.getItem('todos-jquery'));
			} else {
				return [];
			}
		}
	};

	var App = {
		init: function () {
			App.todos = util.getStore();
			App.todoTemplate = Handlebars.compile($('#todo-template').html());
			App.footerTemplate = Handlebars.compile($('#footer-template').html());

			new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');
			App.setUpEventHandlers();
		},
		setUpEventHandlers: function(){
			$('#new-todo').on('keyup', App.addTodo);
			$('#toggle-all').on('change', App.toggleAll);
			$('#footer').on('click', '#clear-completed', App.destroyCompleted);
			$('#todo-list')
				.on('change', '.toggle', App.toggle)
				.on('dblclick', 'label', App.edit)
				.on('keyup', '.edit', App.editKeyup)
				.on('focusout', '.edit', App.update)
				.on('click', '.destroy', App.destroy);
		},
		addTodo: function(event){
			var $input = $(event.target);
			var val = $input.val().trim();

			if (event.which !== ENTER_KEY || !val) {
				return;
			}

			App.todos.push({
				id: util.id(),
				title: val,
				completed: false
			});

			$input.val('');
			App.render();
		},
		render: function () {
			var todos = App.getFilteredTodos();
			$('#todo-list').html(App.todoTemplate(todos));
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked', App.getActiveTodos().length === 0);
			App.renderFooter();
			$('#new-todo').focus();
			util.store(App.todos);
		},
		renderFooter: function () {
			var todoCount = App.todos.length;
			var activeTodoCount = App.getActiveTodos().length;
			var template = App.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: App.filter
			});

			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (event) {
			var isChecked = $(event.target).prop('checked');

			App.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			App.render();
		},
		getActiveTodos: function () {
			return App.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return App.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (App.filter === 'active') {
				return App.getActiveTodos();
			}

			if (App.filter === 'completed') {
				return App.getCompletedTodos();
			}

			return App.todos;
		},
		destroyCompleted: function () {
			App.todos = App.getActiveTodos();
			App.filter = 'all';
			App.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
			var id = $(el).closest('li').data('id');
			var todos = App.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
		toggle: function (e) {
			var i = App.indexFromEl(e.target);
			App.todos[i].completed = !App.todos[i].completed;
			App.render();
		},
		edit: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if (!val) {
				App.destroy(e);
				return;
			}

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				App.todos[App.indexFromEl(el)].title = val;
			}

			App.render();
		},
		destroy: function (e) {
			App.todos.splice(App.indexFromEl(e.target), 1);
			App.render();
		}
	};

	App.init();
});
