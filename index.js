const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//using middleware
app.use(cors());
app.use(express.json());


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9lypro.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //2.
    const productCollection = client.db("productDB").collection("products");
    const brandCollection = client.db("productDB").collection("brands");
    const cartCollection = client.db("productDB").collection("carts");

    //home page e brands gula db theke client e read korate cai
    app.get('/brands', async(req, res) => {
      const cursor = brandCollection.find();
      const brands = await cursor.toArray();
      res.send(brands);
    })

    //5.
    app.get('/brands/:brandName', async(req, res) => {
      const brandName = req.params.brandName;
      const query = {brand_name: (brandName)};
      const result = await brandCollection.findOne(query);
      res.send(result);
    })

   
    //1.ami akon client site theke data nibo post req diye
    app.post('/products', async(req, res) => {
      const newProducts = req.body;
      console.log(newProducts);
       const result = await productCollection.insertOne(newProducts);
       res.send(result);
    })

    // 7 carts api created
    app.post('/carts', async(req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    })

    app.get('/carts', async(req, res) => {
       const cursor = cartCollection.find();
       const result = await cursor.toArray();
       res.send(result);
    })

    // 8. for delete
    app.delete('/carts/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // 3. get korbo
    app.get('/products', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //4. 
    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // 6. updating

    app.put('/products/:id', async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          name : updatedProduct.name, 
          brand :updatedProduct.brand, 
          type : updatedProduct.type, 
          rating : updatedProduct.rating, 
          image : updatedProduct.image, 
          description : updatedProduct.description, 
          price: updatedProduct.price, 
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);

    })

    

   



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("Brand Shop Server is running.");
});

app.listen(port, () => {
  console.log(`Brand Shop is running on port: ${port}`);
});
