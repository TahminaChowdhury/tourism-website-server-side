const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require("mongodb").ObjectId;
const app = express();
const cors =require("cors");
require('dotenv').config();
const port =process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckcl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        
        const database = client.db("guesterra");
        const hotelCollection = database.collection("hotels");
        const bookings = database.collection("bookings")

        // GET api
        app.get('/hotels',async(req,res) => {
          const doc = hotelCollection.find({});
          const result = await doc.toArray();
          res.send(result);
        });

        // find api
        app.get('/hotels/:id', async(req, res) => {
          const id =req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await hotelCollection.findOne(query);
          res.send(result);
        });

         //bookings
         app.post("/bookings", async(req, res) => {
           const result = await bookings.insertOne(req.body);
           res.json(result);
         })
        

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("Running server at port", port)
})


