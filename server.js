const http = require('http');
const { v4: uuid4 } = require('uuid');
const errorHandler = require('./errorHandle');
const todos = [];

const headers = {
   'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
}

const requestListener = (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({ 
      message: 'Hello, World!',
      data: todos,
    }));
    res.end();
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if(title !== undefined) {
          const todo = {
            id: uuid4(),
            title: title,
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({ 
            message: 'success!!!!',
            data: todo,
          }));
          res.end();
        } else {
          errorHandler(res)
        }
      } catch (error) {
        errorHandler(res)
      }
  });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({ 
      essage: 'Delete request received',
      data: todos,}));
    res.end();
  }else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(element => element.id === id);
    console.log(index,id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({ 
        message: 'Delete request received',
        data: todos,
        id: id
      }));
      res.end();
    } else {
      errorHandler(res)
    }
  } else if (req.url === '/todos' && req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({ message: 'Options request received' }));
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({ message: 'Not Found' }));
    res.end();
  }
};

const PORT = 3000;
const server = http.createServer(requestListener);
server.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:${PORT}`);
});