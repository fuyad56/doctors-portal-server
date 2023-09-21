const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

require("dotenv").config();

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.odt7wqf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.post("/addAppointment", async (req, res) => {
  try {
    const appointmentData = req.body; // Assuming you are sending JSON data in the request body

    if (!appointmentData) {
      return res.status(400).json({ error: "Appointment data is required" });
    }

    const database = client.db("doctorsPortal");
    const appointmentsCollection = database.collection("appointment");

    const result = await appointmentsCollection.insertOne(appointmentData);
    if (result.insertedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Appointment created successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create appointment" });
    }
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).json({ success: true, error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDatabase();
});
