const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}))

app.get('/todo', (req, res) => {
    let todoData = fs.readFileSync('./todoData.json', 'utf-8');
    todoData = JSON.parse(todoData);
    res.render('todo', {todoData});
})

app.get('/todo/new', (req, res) => {
    res.render('newTodo')
})

app.post('/todo', async (req, res) => {
    const { todo } = req.body;
    let todoData = fs.readFileSync('./todoData.json', 'utf-8')
    todoData = JSON.parse(todoData);
    if(!todoData[todo['username']]){
        todoData[todo['username']] = [];
    }
    todoData[todo['username']].push(todo['task']);
    todoData = JSON.stringify(todoData);
    fs.writeFileSync('./todoData.json', todoData);
    res.redirect('/todo');
})

app.post('/todo/delete', async(req, res) => {
    const { username, index} = req.body;
    let todoData = fs.readFileSync('./todoData.json', 'utf-8')
    todoData = JSON.parse(todoData);
    todoData[username].splice(index-1, 1);
    todoData = JSON.stringify(todoData);
    fs.writeFileSync('./todoData.json', todoData);
    res.redirect('/todo');

})
app.get('/todo/delete', (req, res) =>{
    res.render('deleteTodo');
})

app.listen(port);

//OUR TODO DATA is like this...
    //{
        //    "username" : [
            //    task1, task2, task3
            //    ] 
            //
            //    
        //}
