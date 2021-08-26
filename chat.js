const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const socketIO = require('socket.io');
const io = socketIO(server);

app.use('/css', express.static(`${__dirname}/node_modules/bootstrap/dist/css`));
app.use('/jq', express.static(`${__dirname}/node_modules/jquery/dist`));

app.get('/', (req, res)=> {
  res.sendFile('./index.html', {root: __dirname})
});

io.on('connection', (socket)=> {

  console.log('Bir kullanıcı bağlandı');

  socket.on('msg', (msg) => {
    
    io.emit('msg', msg)
  });

  socket.on('disconnect', ()=> {
    console.log('Bir kullanıcı ayrıldı');
  })
})

const PORT = 3300

server.listen(PORT, ()=> {
  console.log(`Server ${PORT} portunda çalışmaya başladı.`)
})