var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//model is a to-do
//collection of models/to dos

var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
},{
	id: 2,
	description: 'go to market',
	completed: false
},{
	id: 3,
	description: 'pick up dry cleaning',
	completed: true
}];

app.get('/', function(req, res){
	res.send('Todo API Root');
});

//GET /todos

app.get('/todos', function(req, res){
	res.json(todos);
});

//GET /todos/:id

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


app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT)
});