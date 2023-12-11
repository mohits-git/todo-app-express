const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises; 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));

async function readTodoData() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'todoData.json'), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading todoData.json:', error.message);
        return {};
    }
}

async function writeTodoData(todoData) {
    try {
        await fs.writeFile(path.join(__dirname, 'todoData.json'), JSON.stringify(todoData));
    } catch (error) {
        console.error('Error writing todoData.json:', error.message);
    }
}

app.get('/todo', async (req, res) => {
    const todoData = await readTodoData();
    res.render('todo', { todoData });
});


app.post('/todo', async (req, res) => {
    const { todo } = req.body;
    let todoData = await readTodoData();

    if (!todoData[todo.username]) {
        todoData[todo.username] = [];
    }

    todoData[todo.username].push(todo.task);

    await writeTodoData(todoData);

    res.redirect('/todo');
});

app.get('/todo/new', (req, res) => {
    res.render('newTodo')
})

app.get('/todo/delete', (req, res) =>{
    res.render('deleteTodo');
})

app.post('/todo/delete', async(req, res) => {
    const { username, index} = req.body;

    let todoData = await readTodoData();

    todoData[username].splice(index-1, 1);

    await writeTodoData(todoData);

    res.redirect('/todo');
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//OUR TODO DATA is like this...
    //{
        //    "username" : [
            //    task1, task2, task3
            //    ] 
            //
            //    
        //}
