const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000 ;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


app.use(cors());
app.use(express.json());




const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/dishes',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err){
            console.log(err);
        }else{
            const collection = client.db('redonion').collection('dishes');
            collection.find().toArray((rej,documents) => {
                if(rej){
                    console.log(rej);
                    res.status(500).send("Filed to Fetch Data ")
                }else{
                    res.send(documents);
                }
                // client.close();
            })
        }
    })
})

app.get('/About',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err){
            console.log(err);
        }else{
      
            const collection =  client.db('redonion').collection('About');
            collection.find().toArray((rej,documents) => {
                if(rej){
                    console.log(rej);
                    res.status(500).send("Filed to Fetch Data ")
                }else{
                    res.send(documents);
                }
                // client.close();
            })
        }
    })
})

app.post('/adddish',(req,res)=>{
    const Newfood = req.body;
    console.log(Newfood);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err=>{
        const collection = client.db('redonion').collection('dishes');
        collection.insertOne(Newfood , (rej, result) =>  {
        if(rej){
            res.status(500).send("Filed to insert")
        }else{
            res.send(result.insertedId);
        }

        })
    })
})

app.post('/addAbout',(req,res)=>{
    const About = req.body;
    console.log(About);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err=>{
        const collection = client.db('redonion').collection('About');
        collection.insertOne(About, (rej, result) =>  {
        if(rej){
            res.status(500).send("Filed to insert")
        }else{
            res.send(result.insertedId);
        }

        })
    }
    )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})