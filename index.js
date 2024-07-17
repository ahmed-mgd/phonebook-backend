const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

morgan.token("person", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(morgan(":method :url :response-time :person"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const d = new Date();
  res.send(`
        <h1>Phonebook has info for ${persons.length} people.</h1>
        <h1>${d}</h1>
        `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const newId = Math.floor(Math.random() * 200);
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "missing name or number",
    });
  } else if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "duplicate name",
    });
  }

  const person = {
    id: newId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
