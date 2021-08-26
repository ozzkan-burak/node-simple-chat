const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const session = require("express-session");
const bodyparser = require("body-parser");

const socketIO = require('socket.io');
const { response } = require('express');
const io = socketIO(server);

app.use(bodyparser.urlencoded({etended: false}))

app.use(session({
  secret: "chatSystem",
  resave: false,
  saveUninitialized: false
}));

app.use('/css', express.static(`${__dirname}/node_modules/bootstrap/dist/css`));
app.use('/jq', express.static(`${__dirname}/node_modules/jquery/dist`));

app.get('/', (req, res)=> {

  if(!req.session.user){
    res.sendFile('./index.html', {root: __dirname});
  } else {
    res.sendFile('./chat.html', {root: __dirname});
  }

});

app.post('/chat', (req, res)=> {

  req.session.user = req.body.user;

  if(req.session.user) {
    res.sendFile('./chat.html', {root: __dirname})
  } else {
    res.sendFile('./index.html', {root: __dirname});
  }

});


app.get("/session-open", (req, res)=> {

  // req.session.userName="Burak";
  // req.session.age = "33";
  // console.log(req.session.userName)
  // res.write('Oturum oluşturuldu ' + req.session.userName);
  // res.end();

});

app.get("/session-delete", (req, res)=>{

  delete req.session.age;
  response.end();

});

app.get("/session-check", (req, res)=>{

  console.log(req.session.userName)
  console.log(req.session.age);
  if(req.session.userName) {
    res.write("1. oturum var");

  } else {
    res.write("1. oturum yok");
  }

  if(req.session.age) {
    res.write("2. oturum var");

  } else {
    res.write("2. oturum yok");
    
  }

  res.end();
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