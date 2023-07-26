const express = require ('express')
const app = express()

const port = process.env.PORT||3000

app.use(express.static('public')) 


const dbConnect=require('./db')
dbConnect


const server= app.listen(port,()=>{
    console.log(`Listening on ${port}`)    
})

let io=require('socket.io')(server)
io.on('connection',(socket)=>{

    console.log(`new connection: ${socket.id}`)

    socket.on('comment',(data)=>{ //receiving data
       data.time=Date()
        socket.broadcast.emit('comment',data)
    })

    socket.on('typing',(data)=>{ //receiving data
      
         socket.broadcast.emit('typing',data)
     })
})