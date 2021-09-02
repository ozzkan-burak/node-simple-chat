const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const sharedsession = require('express-socket.io-session');
const bodyparser = require("body-parser");
const fs = require('fs');

const socketIO = require('socket.io');
const { response } = require('express');
const io = socketIO(server);

const session = require('express-session')({
  secret: "chatSystem",
  resave: false,
  saveUninitialized: false
})

app.use(bodyparser.urlencoded({etended: false}))

app.use(session);
io.use(sharedsession(session,{
  autoSave:true
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

  if(req.body.user){
    req.session.user = req.body.user;
  }
  

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

  console.log(`Bir kullanıcı bağlandı ${socket.handshake.session.user}`);

  socket.on('msg', (msg) => {
    
    io.emit('msg', socket.handshake.session.user, msg)
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
  });

  socket.on('chatsave', (chat) => {
    
    let trimChat = chat.trim();
    let cutting = trimChat.split('*');
    let last = cutting.join('\n');


    fs.writeFile('chat.txt', last, (err)=> {
      if(err) throw err
      console.log('dosya eklendi');
    });
    
  });


});

const PORT = 3300

server.listen(PORT, ()=> {
  console.log(`Server ${PORT} portunda çalışmaya başladı.`)
})