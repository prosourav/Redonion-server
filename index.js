const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lahub.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error : ',err);
  const foodCollection = client.db("redonion").collection("dishes");
  // new
  const aboutCollection = client.db("redonion").collection("About");
  // 
  console.log('successFull');

// server creation
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Adding new books to shop

  app.post('/adddish', (req, res)=>{
    const dish = req.body;

    foodCollection.insertOne(dish)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
    
  })
  app.post('/about', (req, res)=>{
    const about = req.body;

     aboutCollection.insertOne(about)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
    
  })

  app.get('/dishes',(req, res)=>{
    foodCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })
  app.get('/about',(req, res)=>{
    aboutCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })
// check out data
  app.get('/fooddetail/:id',(req, res)=>{
    const id = req.params.id;
    foodCollection.findOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      res.send(result);
    })
  })
 

//   //order data 
//   app.post('/order',(req,res)=>{
//     const newOrder = req.body;
//     console.log("New order: ",newOrder);
//     ordersCollection.insertOne(newOrder)
//     .then(result =>{
//       console.log('inserted count: ',result.insertedCount)
//       res.send(result.insertedCount > 0);
//     })
//   })

//   app.get('/order',(req,res)=>{
//     ordersCollection.find({email:req.query.email})
//     .toArray((err, items)=>{
//       res.send(items);
//     })
//   })





//   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})