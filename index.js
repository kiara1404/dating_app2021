const express = require('express');
const app = express();
const port = 1234;

app.get('/', helloWorld);
app.get('/about', about)
app.get('/contact', contact)
app.use(notFound)

app.listen(port, function(){
    console.log('The server is running at http://localhost:1234')
    }
);

function helloWorld(req, res) {
    res.send('hola Mundo')
}

function about(req,res) {
res.send('this is about something')
}

function contact(req, res) {
    res.send('normally you would get some contact info here...')
}

function notFound(req,res) {
    res.status(404).send('something went wrong....')
}