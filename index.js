const express = require('express');
const app = express();
const port = 1234;

app.get('/', helloWorld);

function helloWorld(req, res) {
    res.send('hola Mundo')
}

app.listen(port, function(){
    console.log('The server is running')
    }
);