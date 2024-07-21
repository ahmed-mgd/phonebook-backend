require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("person", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(morgan(":method :url :response-time :person"));

app.get("/info", (req, res) => {
  const d = new Date();
  res.send(`
        <h1>Phonebook has info for ${persons.length} people.</h1>
        <h1>${d}</h1>
        `);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const newId = Math.floor(Math.random() * 200);
  const body = req.body;

  // if (!body.name || !body.number) {
  //   return res.status(400).json({
  //     error: "missing name or number",
  //   });
  // } else if (Person.some((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "duplicate name",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  
  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
  });
  res.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
