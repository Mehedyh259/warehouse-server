const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@medicines.eb4dx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        await client.connect();
        console.log('connected db');
        const medicineCollection = client.db('medicines').collection('products');

        // genarate access token when login
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ accessToken });
        });


        // get all products or limited products of database
        app.get('/products', async (req, res) => {
            const limit = Number(req.query.limit);
            const cursor = medicineCollection.find({});

            if (limit) {
                const products = await cursor.limit(limit).toArray();
                res.send(products);
            } else {
                const products = await cursor.toArray();
                res.send(products);
            }

        });
        // get a single product by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await medicineCollection.findOne(query);
            res.send(product);
        });

        // get products by email 
        app.get('/product', async (req, res) => {
            const queryEmail = req.query.email;
            const query = { email: queryEmail };
            const cursor = medicineCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // post api for adding new product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await medicineCollection.insertOne(newProduct);
            res.send(result);
        })

        // update a product quantity by id
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const newQuantity = req.body;
            const search = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: newQuantity.quantity
                }
            };
            const result = await medicineCollection.updateOne(search, updatedDoc, options);
            res.send(result);
        })

        // delete a product by id
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await medicineCollection.deleteOne(query);
            res.send(result);
        });

    } finally {

    }
}
run().catch(console.dir);





// server root url

app.get('/', async (req, res) => {
    res.send('Server is running');
});



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
