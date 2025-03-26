const mongoose = require("mongoose");
require("dotenv").config();

const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
    useUnifiedTopology: true,
  },
};

async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(process.env.DATABASE_KEY, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error.message);
  }
}
module.exports = connectDB;
