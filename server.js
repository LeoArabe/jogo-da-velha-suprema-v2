import express from 'express'
import http from 'http'
import { Server } from "socket.io";
import ejs from "ejs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()

const server = http.createServer(app)
const io = new Server(server);

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
  if (req.headers["x-forwarded-proto"] == "http") //Checa se o protocolo informado nos headers é HTTP 
      res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
  else //Se a requisição já é HTTPS 
      next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});

app.use(express.static("public"));
app.use("/vendor", express.static("./node_modules"));

app.set("views", "./public");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.get("/", (req, res) => {
  return res.render("index.html");
});

  io.on('connection', (socket) => {
    let id = socket.id;
    console.log("Novo cliente conectado. ID => " + id);
      socket.on('click', (data) => {
        socket.broadcast.emit('marca', (data));
      });
      socket.on('reinicia', () => {
        io.emit('reiniciou');
      });
  });

server.listen(5500, function(){
    console.log('Listening on port 5500')
});