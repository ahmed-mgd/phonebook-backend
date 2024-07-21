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
  Person.find().then((result) => {
    res.send(`
          <h1>Phonebook has info for ${result.length} people.</h1>
          <h1>${d}</h1>
          `);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find().then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
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
    number: body.number,
  });

  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
  });
  res.json(person);
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
