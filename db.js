function dbConnect() {
    const mongoose = require ('mongoose')
const url = 'mongodb://localhost/comments'
mongoose.connect(url,{
  
    useUnifiedTopology: true,
   
})

const connection= mongoose.connection
connection.once('open',()=>{
    console.log('Database Connected')
})
}

module.exports = dbConnect