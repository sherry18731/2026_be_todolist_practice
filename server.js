const http = require('http');
const { v4 : uuid4 } = require('uuid');
const errorHandler = require('./errorHandle');
const todos = [];

const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',  // 允許任何網站存取 API。
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',  // 允許操作方式
  'Content-Type': 'application/json'  // 回傳格式
}

const requestListener = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/todos' && req.method ==='GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      message: '成功取得資料。',
      data: todos,
    }));
    res.end();
  } else if(req.url === '/todos' && req.method ==='POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if(!title) {
          return errorHandler(res)
        }
        const todo = {
          id: uuid4(),
          title
        }
        todos.push(todo);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          message: '成功新增資料。',
          data: todo,
        }));
        res.end();
      } catch(error) {
        errorHandler(res)
      }
    })
  } else if(req.url === '/todos' && req.method ==='DELETE') {
    todos.length = 0;
    res.writeHead('200', headers);
    res.write(JSON.stringify({
      message: '成功刪除全部資料',
      data: todos,
    }));
    res.end();
  } else if(req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(element => element.id === id);
    console.log(index, id);
    if (index != -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        message: '已刪除這一筆代辦事項',
        data: todos,
        id: id
      }));
      res.end();
    } else {
      errorHandler(res)
    }
  } else if(req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end' , () => {
      try {
        const todo = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "message" : "已成功修改這筆資料",
            "data" : todos,
          }));
          res.end();
        } else {
          errorHandler(res);
        }

      } catch {
        errorHandler(res);
      }
    })
  } else if (req.url === '/todos' && req.method ==='OPTIONS') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      message: '已收到請求'
    }));
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      message: '無此頁面'
    }));
    res.end();
  }

};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3003)
