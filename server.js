const express = require('express');
const server = express();
const dbRouter = require('./db-router');

server.use(express.json());
// server.use(cors());
server.use('/api/posts', dbRouter);

server.get('/', (req,res)=>{
    res.send(`<h2>Post Router API</h2>`)
})

module.exports = server;