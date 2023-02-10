const mongoose= require('mongoose');
const Event= require('../models/eventsDB')


mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/the-controversies');
const events= require('./eventsSeeds');
const db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log('Database connected')
});


const seedDB= async()=>{
   await Event.deleteMany({});
    for(let i=0 ; i<events.length; i++ ){
  
    const event= new Event({
       
        title: `${events[i].title}`,
        author: '63d42950b4e62324f081ae16',
        description: `${events[i].description}`,
        content: `${events[i].content}`
    });
  
await event.save(); 


};

}


module.exports=seedDB()
.then(
    ()=>{mongoose.connection.close()}
)