import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URL = "mongodb://127.0.0.1:27017";
async function createConnection() {
  const client = new MongoClient(MONGODB_URL);
  await client.connect();
  console.log("Mongodb Connected");
  return client;
}
export const client = await createConnection();

app.get("/", function (req, res) {
  res.send("Welcome To login page😊");
});

app.post("/login", async function (req, res) {
  const { name, password } = req.body;
  const user = await client
    .db("userdetails")
    .collection("users")
    .findOne({ name: name });
  if (user) {
    const pass = user.password;
    if (pass === password) {
      res.send({ msg: "Login Successfully" });
    } else {
      res.status(401).send("Incorrect Password");
    }
  } else {
    //  res.status(401).send("invalid credential")

    const user = await client
      .db("userdetails")
      .collection("users")
      .insertOne(req.body);
    res.send({ msg: "Signup Successfully" });
  }
});

app.listen(4000, () => {
  console.log(`Server started`);
});
