const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//
const mongoUrl = process.env.MONGODB_URI;
const dbName = "TodoApp";

const client = new MongoClient(mongoUrl);

// CRUD -> Create Read/GET Update Delete/Delete
client
  .connect()
  .then(() => {
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);
    const todosCollection = db.collection("todos");

    // CREATE A TODO
    app.post("/todos", async (req, res) => {
      console.log(req.body);
      //   const newTodo = { title: "Lunch", description: "Dupurer Lunch" };
      const newTodo = req.body;
      try {
        const result = await todosCollection.insertOne(newTodo);
        res.status(201).json({ ...newTodo, _id: result.insertedId });
      } catch {
        res.status(500).json({ error: "Failed to create Todo" });
      }
    });

    // GET ALL TODOS
    app.get("/todos", async (req, res) => {
      // const todos = [
      //   {
      //     id: 1,
      //     title: "Hello World",
      //     description: "Welcome to my World",
      //     author: "Jamil",
      //   },
      //   {
      //     id: 2,
      //     title: "Hello World",
      //     description: "Welcome to my World",
      //     author: "Jamil",
      //   },
      //   {
      //     id: 3,
      //     title: "Hello World",
      //     description: "Welcome to my World",
      //     author: "Jamil",
      //   },
      // ];
      try {
        const todos = await todosCollection.find({}).toArray();
        // console.log(todos);
        res.json(todos);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch todos" });
      }
      // res.json(todos);
    });

    // GET SINGLE TODOS
    app.get("/todos/:id", async (req, res) => {
      // console.log(req.params.id, "70 no line");
      const id = req.params.id;
      try {
        const todo = await todosCollection.findOne({ _id: new ObjectId(id) });
        res.json(todo);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch todo." });
      }
    });

    // UPDATE SINGLE TODO
    app.put("/todos/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const updatedTodo = req.body;
      // console.log(updatedTodo);

      try {
        const result = await todosCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTodo }
        );
        // console.log(result)
        res.json({ message: "Todo Updated Successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to update todo" });
      }
    });

    // DELETE A TODO
    app.delete("/todos/:id", async (req, res) => {
      const deleteId = req.params.id;
      try {
        const result = await todosCollection.deleteOne({
          _id: new ObjectId(deleteId),
        });
        console.log(result);
        res.json({ message: `${deleteId} has been deleted` });
      } catch (error) {
        res.status(500).json({ error: "Failed to delte todo" });
      }
    });

    // get, post, put, patch, delete
    app.get("/", (req, res) => {
      res.send("Welcome to our new website - That is running on port 5000");
    });

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
