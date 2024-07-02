import io from "../app.js"
io.on('s',(socket)=>{
console.log(socket.id);
})