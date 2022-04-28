const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@medicines.eb4dx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    await client.connect();
    console.log('connected db');
}
run().catch(console.dir);





// server root url

app.get('/', async (req, res) => {
    res.send('Server is running');
});



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
