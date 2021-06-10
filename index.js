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
  const aboutCollection = client.db("redonion").collection("About");
  const cartCollection = client.db("redonion").collection("cart");
  const ordersCollection = client.db("redonion").collection("orders");

  // 
  console.log('successFull');

// server creation
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Adding new products

  app.post('/adddish', (req, res)=>{
    const dish = req.body;
    foodCollection.insertOne(dish)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
    
  })
  //Adding new pros of our company
  app.post('/addAbout', (req, res)=>{
    const about = req.body;
     aboutCollection.insertOne(about)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
    
  })
// reading all data of dishes
  app.get('/dishes',(req, res)=>{
    const search = req.query.search;
    foodCollection.find({})
    .toArray((err, items)=>{
      res.send(items);
    })
  })
// reading single data of dishes
  app.get('/dishesdata',(req, res)=>{
    const search = req.query.search;
    foodCollection.find({dishName:{$regex:search}})
    .toArray((err, items)=>{
      res.send(items);
    })
  })
  // reading all data of about
  app.get('/about',(req, res)=>{
    aboutCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })
  // getting all data of orders a user
  app.get('/myCart',(req,res)=>{
    const Name = req.query.name;
    cartCollection.find({UserName:Name})
    .toArray((err, items)=>{
      res.send(items);
    })
  })
  
// reading dish detail data
  app.get('/fooddetail/:id',(req, res)=>{
    const id = req.params.id;
    foodCollection.findOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      res.send(result);
    })
  })
 

  //cart data 
  app.post('/addToCart',(req,res)=>{
    const cart = req.body;
    // console.log("New cart: ",cart);
    cartCollection.insertOne(cart)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0);
    })
  })


  // orders
  app.post('/orders',(req,res)=>{
    const order = req.body;
    // console.log("New cart: ",order);
    ordersCollection.insertOne(order)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0);
    })
  })
// reading my orders items
  app.get('/myOrders',(req,res)=>{
    const ordrId = req.query.orderId;
    ordersCollection.find({orderId:ordrId})
    .toArray((err, items)=>{
      // console.log(items);
      res.send(items);
    })
  })
// cart quantity update
  app.patch('/updateQuantity/:id',(req,res)=>{
    const dishId = req.body.id;
    const newQuantity = req.body.newQuantity;
    cartCollection.updateOne({_id:ObjectId(dishId)},{
      $set:{QuanTity:newQuantity}
    }
    )
    .then(result=>{
      res.send(result.modifiedCount > 0);
      // console.log(result);
    })
  })
  // delete from cart
  app.delete('/deleteItem/:id',(req,res)=>{
    const itemId = req.params.id;
    // console.log(itemId);
    cartCollection.deleteOne({_id:ObjectId(itemId)})
    .then(result=>{
      res.send(result.modifiedCount > 0);
    })
  })


  app.delete('/deleteCart',(req,res)=>{
    cartCollection.deleteMany()
    .then(result=>{
      res.send(result.modifiedCount > 0);
    })
  })



//   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})