const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.Db_USER}:${process.env.DB_PASS}@cluster0.qemc4ul.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const serviceCollection = client.db('carDoctor').collection('services');
        const bookingCollection = client.db('carDoctor').collection('bookings');

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1 },
            };


            const result = await serviceCollection.findOne(query, options);
            res.send(result);
        })

        //bookings
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Car Doctor Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                text-align: center;
            }

            .container {
                margin: 100px auto;
                padding: 100px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }

            h1 {
                color: #333;
                font-size: 40px;
            }
            p {
                font-size: 20px;
                font-weight: bold;
                margin: 30px;
            }
            .button-link {
                text-decoration: none;
                background-color: #FF3811;
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                transition: background-color 0.3s; /* Add transition for smooth effect */
            }
            .button-link:hover {
                background-color:#000000; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Car Doctor Server Is Running...</h1>
            <p><a class="button-link" href="/services">Go to services page</a></p>
        </div>
    </body>
    </html>`)
})

app.listen(port, () => {
    console.log(`Car Doctor Server Is Running On Port ${port}`)
})