var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

//model is a to-do
//collection of models/to dos

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

//GET /todos?completed=false&q=taskdescription

app.get('/todos', function(req, res){
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todoItem){
			return todoItem.description.indexOf(queryParams.q) > 0;
		});
	}


	res.json(filteredTodos);
});

//GET /todos/:id
/*
app.get('/todos/:id', function(req, res){

var found = false;

	for(var x = 0; x < todos.length; x++){
		if (todos[x].id === parseInt(req.params.id, 10)){

			found = true;
			res.json(todos[x]);
		}
	}

	if (!found){
		res.send('Asking for todo with ID: ' + req.params.id);
		res.status(404).send(); //ID not found	
	}
	

});
*/

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var found = _.findWhere(todos, {id: todoId});

	if (found){
		res.json(found);
	} else{
		res.status(404).send(); //ID not found	
	}
	

});

//POST /todos
/*
app.post('/todos', function(req, res){
	var body = req.body;

	console.log('description' + req.body.description);

	body.id = todoNextId;

	todos.push(body);

	todoNextId++;

	res.json(body);
});
*/

app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

//pick method within underscore.js

	body.id = todoNextId;
	body.description = body.description.trim();

	todos.push(body);

	todoNextId++;

	res.json(body);
});

//DELETE

app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);
	var found = _.findWhere(todos, {id: todoId});

	if (found){
		todos = _.without(todos, found);

		res.json(todos);
	} else{
		res.status(404).json({"error": "no todo found with that id"}); //ID not found	
	}


});

//PUT /todos/:id

app.put('/todos/:id', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id, 10);
	var found = _.findWhere(todos, {id: todoId});

	if (!found){
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}else {
		//never provided value, no problem
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) || body.description.trim().length === 0){
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}else {
		//never provided value, no problem
	}	

	_.extend(found, validAttributes);

	res.json(found);
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT)
});